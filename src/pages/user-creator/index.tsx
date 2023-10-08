import LayoutDefault from "@/layouts/LayoutDefault";
import ContentContainer from "@/components/ContentContainer";
import {isNotEmpty, useForm} from "@mantine/form";
import {Button, Checkbox, Divider, Grid, MultiSelect, Text, Textarea, TextInput} from "@mantine/core";
import {
  generateQueryAssignBussArea,
  generateQueryAssignMultiCompany,
  generateQueryAssignRole,
  generateQueryInsertUser,
  MASTER_ROLES
} from "@/services/userCreatorService";
import React, {useState} from "react";

type UserCreatorForm = {
  bussAreaLv1: string,
  bussAreaLv2: string,
  isWithDbId: boolean,
  selectedRoles: string[]
}

const roleList: string[] = Array.from(MASTER_ROLES.keys())

export default function UserCreator() {
  const form = useForm<UserCreatorForm>({
    initialValues: {
      bussAreaLv1: '',
      bussAreaLv2: '',
      isWithDbId: false,
      selectedRoles: [...roleList]
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

  function handleOnSubmit(event: React.FormEvent) {
    event.preventDefault()
    form.validate()

    if (!form.isValid()) return

    let finalUserInsert: string[] = [];
    let finalAssignRole: string[] = [];
    let finalAssignBussArea: string[] = [];
    let finalAssignMulti: string[] = [];

    const selectedRoles = form.values.selectedRoles
    selectedRoles.forEach(roleName => {
      const role = MASTER_ROLES.get(roleName)

      if (role) {
        const bussArea = role.level === '2' ? form.values.bussAreaLv2 : form.values.bussAreaLv1;

        finalUserInsert.push(generateQueryInsertUser(role.name, bussArea, form.values.isWithDbId))
        finalAssignRole.push(generateQueryAssignRole(role.name, bussArea))
        finalAssignBussArea.push(generateQueryAssignBussArea(role.name, bussArea, form.values.isWithDbId))

        if (role.level === 'multi') {
          finalAssignMulti.push(generateQueryAssignMultiCompany(role.name, bussArea))
        }
      }
    })

    setUserInsert(finalUserInsert.join(`\n`));
    setAssignRole(finalAssignRole.join(`\n`));
    setAssignBussArea(finalAssignBussArea.join(`\n`));
    setAssignMulti(finalAssignMulti.join(`\n`));
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
        </Grid>
      </ContentContainer>
    </LayoutDefault>
  )
}
