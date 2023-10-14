import {describe, expect, test} from "@jest/globals";
import {
	generateQueryAssignMultiCompany,
	generateQueryAssignBussArea,
	generateQueryAssignRole,
	generateQueryInsertUser,
	generateAllQuery, MASTER_ROLES, generateAllQueryByBussAreaList
} from "@/services/userCreatorService";

describe('User Creator Service Test', () => {
	test('Generate insert query', () => {
		const role = 'creator-lv2'
		const bussArea = '5611'
		const hashedPassword: string = '$2y$10$9PCJ.5bX0RHt1Zq7gFiswOcigO1kvwXRP5V.xgG3rpSVbYY4S4Pvm'

		const test1 = generateQueryInsertUser(role, bussArea, hashedPassword)

		expect(test1).toBe(`INSERT INTO "USERS" ("USERNAME", "NAME", "EMAIL", "password", "ACTIVE_DIRECTORY", "STATUS", "CREATED_AT") VALUES ('creator_lv2_5611', 'CREATOR LV2 5611', 'creator_lv2_5611@email.test', '$2y$10$9PCJ.5bX0RHt1Zq7gFiswOcigO1kvwXRP5V.xgG3rpSVbYY4S4Pvm', '0', 'ACTV', SYSTIMESTAMP);`)

		const test2 = generateQueryInsertUser(role, bussArea, hashedPassword, true)

		expect(test2).toBe(`INSERT INTO "USERS" ("ID", "USERNAME", "NAME", "EMAIL", "password", "ACTIVE_DIRECTORY", "STATUS", "CREATED_AT") VALUES ((SELECT NVL(MAX(ID), 0)+1 FROM "USERS"), 'creator_lv2_5611', 'CREATOR LV2 5611', 'creator_lv2_5611@email.test', '$2y$10$9PCJ.5bX0RHt1Zq7gFiswOcigO1kvwXRP5V.xgG3rpSVbYY4S4Pvm', '0', 'ACTV', SYSTIMESTAMP);`)
	})

	test('Generate assign role query', () => {
		const test = generateQueryAssignRole('creator-lv2', '5611')

		expect(test).toBe(`INSERT INTO "ROLE_USER" ("USER_ID", "ROLE_ID") VALUES ((SELECT MAX(ID) FROM "USERS" WHERE "USERNAME" = 'creator_lv2_5611'), (SELECT MAX(ID) FROM "ROLES" WHERE "NAME" = 'creator-lv2'));`)
	})

	test('Generate assign buss area query', () => {
		const role = 'creator-lv2'
		const bussArea = '5611'

		const test1 = generateQueryAssignBussArea(role, bussArea)

		expect(test1).toBe(`INSERT INTO "AREA_USER" ("USER_ID", "BUSINESSAREA_ID", "CREATED_AT") VALUES ((SELECT MAX(ID) FROM "USERS" WHERE "USERNAME" = 'creator_lv2_5611'), (SELECT MAX(ID) FROM "M_BUSINESS_AREA" WHERE "BUSINESS_AREA" = '5611'), SYSTIMESTAMP);`)

		const test2 = generateQueryAssignBussArea(role, bussArea, true)

		expect(test2).toBe(`INSERT INTO "AREA_USER" ("ID", "USER_ID", "BUSINESSAREA_ID", "CREATED_AT") VALUES ((SELECT NVL(MAX(ID), 0)+1 FROM "AREA_USER"), (SELECT MAX(ID) FROM "USERS" WHERE "USERNAME" = 'creator_lv2_5611'), (SELECT MAX(ID) FROM "M_BUSINESS_AREA" WHERE "BUSINESS_AREA" = '5611'), SYSTIMESTAMP);`)
	})

	test('Generate assign multi company', () => {
		const test = generateQueryAssignMultiCompany('creator-spi', '5601')

		expect(test).toBe(`INSERT INTO "USER_COCODE_ROLE" ("USER_ID", "COMPANY_CODE_ID") VALUES ((SELECT MAX(ID) FROM "USERS" WHERE "USERNAME" = 'creator_spi_5601'), (SELECT MAX(ID) FROM "M_COMPANY_CODE" WHERE "COMPANY_CODE" = '5600'));`)
	})

	test('Generate all query to array', () => {
		const roleList: string[] = Array.from(MASTER_ROLES.keys())
		const bussAreaLv2List: string[] = ['5611']
		const bussAreaLv1List: string = '5601'
		const hashedPassword = '123'
		const isWithDbId = true

		const result1 = generateAllQuery(roleList, bussAreaLv2List, bussAreaLv1List, hashedPassword, isWithDbId)

		expect(result1.userInsertQueryList.length).toBe(36)
		expect(result1.assignRoleQueryList.length).toBe(36)
		expect(result1.assignBuseAreaQueryList.length).toBe(36)
		expect(result1.assignMultiQueryList.length).toBe(30)

		bussAreaLv2List.push('5612')
		bussAreaLv2List.push('5613')
		const result2 = generateAllQuery(roleList, bussAreaLv2List, bussAreaLv1List, hashedPassword, isWithDbId)

		expect(result2.userInsertQueryList.length).toBe(42)
		expect(result2.assignRoleQueryList.length).toBe(42)
		expect(result2.assignBuseAreaQueryList.length).toBe(42)
		expect(result2.assignMultiQueryList.length).toBe(30)
	})

	test('Generate all query by business area list', () => {
		const bussAreaList: string[] = ['5611', '5612', '7812', '7814', '6515']

		const result = generateAllQueryByBussAreaList(bussAreaList, '123', true)

		expect(result.userInsertQueryList.length).toBe(114)
		expect(result.assignRoleQueryList.length).toBe(114)
		expect(result.assignBuseAreaQueryList.length).toBe(114)
		expect(result.assignMultiQueryList.length).toBe(90)
		expect(result.userNameList.length).toBe(114)
	})
})
