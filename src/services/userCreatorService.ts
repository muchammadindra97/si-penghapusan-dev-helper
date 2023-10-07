export function generateUserName(roleName: string, bussArea: string): string {
	return `${roleName.replaceAll('-', '_')}_${bussArea}`
}

export function generateCompanyCode(bussArea: string): string {
	return `${bussArea.slice(0, 2)}00`
}

export function generateQueryInsertUser(roleName: string, bussArea: string, isWithDbId: boolean = false): string {
	const userName = generateUserName(roleName, bussArea)
	const name = userName.replaceAll('_', ' ').toUpperCase()

	return `INSERT INTO "USERS" (${isWithDbId ? '"ID", ' : ''}"USERNAME", "NAME", "EMAIL", "password", "ACTIVE_DIRECTORY", "STATUS", "CREATED_AT") VALUES (${isWithDbId ? `(SELECT NVL(MAX(ID), 0)+1 FROM "USERS"), ` : ''}'${userName}', '${name}', '${userName}@email.test', '$2y$10$9PCJ.5bX0RHt1Zq7gFiswOcigO1kvwXRP5V.xgG3rpSVbYY4S4Pvm', '0', 'ACTV', SYSTIMESTAMP);`
}

export function generateQueryAssignRole(roleName: string, bussArea: string, isWithDbId: boolean = false): string {
	const userName = generateUserName(roleName, bussArea)
	const name = `${roleName.replaceAll('-', ' ')} ${bussArea}`.toUpperCase()

	return `INSERT INTO "ROLE_USER" ("USER_ID", "ROLE_ID") VALUES ((SELECT MAX(ID) FROM "USERS" WHERE "USERNAME" = '${userName}'), (SELECT MAX(ID) FROM "ROLES" WHERE "NAME" = '${roleName}'));`
}

export function generateQueryAssignBussArea(roleName: string, bussArea: string, isWithDbId: boolean = false): string {
	const userName = generateUserName(roleName, bussArea)

	return `INSERT INTO "AREA_USER" (${isWithDbId ? '"ID", ' : ''}"USER_ID", "BUSINESSAREA_ID", "CREATED_AT") VALUES (${isWithDbId ? `(SELECT NVL(MAX(ID), 0)+1 FROM "AREA_USER"), ` : ''}(SELECT MAX(ID) FROM "USERS" WHERE "USERNAME" = '${userName}'), (SELECT MAX(ID) FROM "M_BUSINESS_AREA" WHERE "BUSINESS_AREA" = '${bussArea}'), SYSTIMESTAMP);`
}

export function generateQueryAssignMultiCompany(roleName: string, bussArea: string): string {
	const userName = generateUserName(roleName, bussArea)
	const companyCode = generateCompanyCode(bussArea)

	return `INSERT INTO "USER_COCODE_ROLE" ("USER_ID", "COMPANY_CODE_ID") VALUES ((SELECT MAX(ID) FROM "USERS" WHERE "USERNAME" = '${userName}'), (SELECT MAX(ID) FROM "M_COMPANY_CODE" WHERE "COMPANY_CODE" = '${companyCode}'));`
}
