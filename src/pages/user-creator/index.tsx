import LayoutDefault from "@/layouts/LayoutDefault";
import ContentContainer from "@/components/ContentContainer";
import {isNotEmpty, useForm} from "@mantine/form";
import {Button, Checkbox, Divider, Grid, MultiSelect, Text, Textarea, TextInput} from "@mantine/core";
import {
  exportStringToSqlFile,
  generateAllQuery,
  MASTER_ROLES
} from "@/services/userCreatorService";
import React, {useState} from "react";

type UserCreatorForm = {
  bussAreaLv1: string,
  bussAreaLv2: string,
  isWithDbId: boolean,
  selectedRoles: string[],
  hashedPassword: string
}

const roleList: string[] = Array.from(MASTER_ROLES.keys())

export default function UserCreator() {
  const form = useForm<UserCreatorForm>({
    initialValues: {
      bussAreaLv1: '',
      bussAreaLv2: '',
      isWithDbId: false,
      selectedRoles: [...roleList],
      hashedPassword: process.env.NEXT_PUBLIC_USER_CREATOR_DEFAULT_PASSWORD ?? ''
    },
    validate: {
      bussAreaLv1: isNotEmpty('Tidak boleh kosong!'),
      bussAreaLv2: isNotEmpty('Tidak boleh kosong!'),
      selectedRoles: isNotEmpty('Harap pilih minimal satu!')
    }
  })

  const [userInsert, setUserInsert] = useState<string>('')
  const [assignRole, setAssignRole] = useState<string>('')
  const [assignBussArea, setAssignBussArea] = useState<string>('')
  const [assignMulti, setAssignMulti] = useState<string>('')

  const isResultsNotEmpty = !userInsert && !assignRole && !assignBussArea && !assignMulti

  function handleOnSubmit(event: React.FormEvent) {
    event.preventDefault()
    form.validate()

    if (!form.isValid()) return

    const selectedRoles = form.values.selectedRoles
    const bussAreaLv2List = form.values.bussAreaLv2.split(',')

    const result = generateAllQuery(selectedRoles, bussAreaLv2List, form.values.bussAreaLv1, form.values.hashedPassword, form.values.isWithDbId)

    setUserInsert(result.userInsertQueryList.join(`\n`));
    setAssignRole(result.assignRoleQueryList.join(`\n`));
    setAssignBussArea(result.assignBuseAreaQueryList.join(`\n`));
    setAssignMulti(result.assignMultiQueryList.join(`\n`));
  }

  function handleOnExportSql(): void {
    let result: string = ''

    result += `-- User Insert\n`
    result += userInsert
    result += `\n\n`

    result += `-- Assign Role\n`
    result += assignRole
    result += `\n\n`

    result += `-- Assign Buss Area\n`
    result += assignBussArea
    result += `\n\n`

    result += `-- Assign Multi Code\n`
    result += assignMulti
    result += `\n\n`

    exportStringToSqlFile(result)
  }

  return (
    <LayoutDefault>
      <ContentContainer title="User Creator">
        <form onSubmit={handleOnSubmit}>
          <Grid>
            <Grid.Col>
              <TextInput label="Business Area Lv1" withAsterisk {...form.getInputProps('bussAreaLv1')} maw="300px" />
            </Grid.Col>
            <Grid.Col>
              <TextInput label="Business Area Lv2" withAsterisk {...form.getInputProps('bussAreaLv2')} maw="300px" />
            </Grid.Col>
            <Grid.Col>
              <MultiSelect
                label="Pilih Role"
                data={roleList}
                maxDropdownHeight={200}
                maw="500px"
                withAsterisk
                {...form.getInputProps('selectedRoles')}
                clearable
                searchable
                hidePickedOptions
                description={`${form.values.selectedRoles.length} terpilih dari ${roleList.length}`}
              />
            </Grid.Col>
            <Grid.Col>
              <TextInput label="Hashed Password" withAsterisk {...form.getInputProps('hashedPassword')} maw="300px" />
            </Grid.Col>
            <Grid.Col>
              <Checkbox
                label="Dengan insert ID row manual? (tanpa trigger)"
                {...form.getInputProps('isWithDbId', { type: "checkbox"})}
              />
            </Grid.Col>
            <Grid.Col>
              <Button type="submit">Generate Query</Button>
            </Grid.Col>
          </Grid>
        </form>
        <Divider my="md" label={<Text fw="bolder">Result</Text>} labelPosition="center" />
        <Grid>
          <Grid.Col>
            <Textarea label="SQL User Insert" value={userInsert} readOnly rows={10}/>
          </Grid.Col>
          <Grid.Col>
            <Textarea label="SQL Assign Role" value={assignRole} readOnly rows={10}/>
          </Grid.Col>
          <Grid.Col>
            <Textarea label="SQL Assign Buss Area" value={assignBussArea} readOnly rows={10}/>
          </Grid.Col>
          <Grid.Col>
            <Textarea label="SQL Assign Multi Code" value={assignMulti} readOnly rows={10}/>
          </Grid.Col>
          <Grid.Col>
            <Grid>
              <Grid.Col span='shrink'>
                <Button type="submit" onClick={handleOnExportSql} disabled={isResultsNotEmpty} color='yellow.5'>Export SQL</Button>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>
      </ContentContainer>
    </LayoutDefault>
  )
}
