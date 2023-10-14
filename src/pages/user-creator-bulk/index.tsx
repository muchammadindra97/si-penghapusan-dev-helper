import LayoutDefault from "@/layouts/LayoutDefault";
import ContentContainer from "@/components/ContentContainer";
import {isNotEmpty, useForm} from "@mantine/form";
import {Button, Checkbox, Flex, Grid, TextInput, Divider, Text} from "@mantine/core";
import {
  exportStringToSqlFile,
  exportUsernamesToCsvFile,
  generateAllQueryByBussAreaList,
  UserNameForList
} from "@/services/userCreatorService";
import React, {useRef, useState} from "react";

type UserCreatorBulkForm = {
  bussAreaLv2List: string,
  isWithDbId: boolean,
  hashedPassword: string
}

export default function UserCreator() {
  const form = useForm<UserCreatorBulkForm>({
    initialValues: {
      bussAreaLv2List: '',
      isWithDbId: false,
      hashedPassword: process.env.NEXT_PUBLIC_USER_CREATOR_DEFAULT_PASSWORD ?? ''
    },
    validate: {
      bussAreaLv2List: isNotEmpty('Tidak boleh kosong!'),
    }
  })

  const [userInsert, setUserInsert] = useState<string>('')
  const [assignRole, setAssignRole] = useState<string>('')
  const [assignBussArea, setAssignBussArea] = useState<string>('')
  const [assignMulti, setAssignMulti] = useState<string>('')
  const userNamesList = useRef<UserNameForList[]>([])

  const isResultsNotEmpty = !userInsert && !assignRole && !assignBussArea && !assignMulti

  function handleOnSubmit(event: React.FormEvent) {
    event.preventDefault()
    form.validate()

    if (!form.isValid()) return

    const bussAreaLv2List = form.values.bussAreaLv2List.split(',')

    const result = generateAllQueryByBussAreaList(bussAreaLv2List, form.values.hashedPassword, form.values.isWithDbId)

    setUserInsert(result.userInsertQueryList.join(`\n`));
    setAssignRole(result.assignRoleQueryList.join(`\n`));
    setAssignBussArea(result.assignBuseAreaQueryList.join(`\n`));
    setAssignMulti(result.assignMultiQueryList.join(`\n`));
    userNamesList.current = result.userNameList
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

  function handleOnExportUsernames(): void {
    exportUsernamesToCsvFile(userNamesList.current)
  }

  return (
    <LayoutDefault>
      <ContentContainer title="User Creator">
        <form onSubmit={handleOnSubmit}>
          <Grid>
            <Grid.Col>
              <TextInput label="Business Area Lv2 List (comma separated)" withAsterisk {...form.getInputProps('bussAreaLv2List')} maw="300px" />
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
            <Flex
              gap="md"
            >
              <Button type="submit" onClick={handleOnExportSql} disabled={isResultsNotEmpty} color='yellow.5'>Export SQL</Button>
              <Button type="submit" onClick={handleOnExportUsernames} disabled={isResultsNotEmpty} color='green.8'>Export Usernames CSV</Button>
            </Flex>
          </Grid.Col>
        </Grid>
      </ContentContainer>
    </LayoutDefault>
  )
}
