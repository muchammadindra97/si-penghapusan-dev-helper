import {describe, expect, test} from "@jest/globals";
import {
	generateQueryAssignMultiCompany,
	generateQueryAssignBussArea,
	generateQueryAssignRole,
	generateQueryInsertUser
} from "@/services/userCreatorService";

describe('User Creator Service Test', () => {
	test('Generate insert query', () => {
		const role = 'creator-lv2'
		const bussArea = '5611'

		const test1 = generateQueryInsertUser(role, bussArea)

		expect(test1).toBe(`INSERT INTO "USERS" ("USERNAME", "NAME", "EMAIL", "password", "ACTIVE_DIRECTORY", "STATUS", "CREATED_AT") VALUES ('creator_lv2_5611', 'CREATOR LV2 5611', 'creator_lv2_5611@email.test', '$2y$10$9PCJ.5bX0RHt1Zq7gFiswOcigO1kvwXRP5V.xgG3rpSVbYY4S4Pvm', '0', 'ACTV', SYSTIMESTAMP);`)

		const test2 = generateQueryInsertUser(role, bussArea, true)

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
})
