export type MASTER_ROLE = {
	name: string,
	level: '2'|'1'|'0'|'multi'
}

export const MASTER_ROLES = new Map<string, MASTER_ROLE>([
	['creator-lv2', { name: 'creator-lv2', level: '2'}],
	['reviewer-lv2', { name: 'reviewer-lv2', level: '2'}],
	['approver-lv2', { name: 'approver-lv2', level: '2'}],
	['creator-lv1', { name: 'creator-lv1', level: '1'}],
	['reviewer-lv1', { name: 'reviewer-lv1', level: '1'}],
	['approver-lv1', { name: 'approver-lv1', level: '1'}],
	['creator-spi', { name: 'creator-spi', level: 'multi'}],
	['reviewer-spi', { name: 'reviewer-spi', level: 'multi'}],
	['approver-spi', { name: 'approver-spi', level: 'multi'}],
	['creator-hukum', { name: 'creator-hukum', level: 'multi'}],
	['reviewer-1-hukum', { name: 'reviewer-1-hukum', level: 'multi'}],
	['reviewer-2-hukum', { name: 'reviewer-2-hukum', level: 'multi'}],
	['approver-hukum', { name: 'approver-hukum', level: 'multi'}],
	['creator-resiko', { name: 'creator-resiko', level: 'multi'}],
	['reviewer-1-resiko', { name: 'reviewer-1-resiko', level: 'multi'}],
	['reviewer-2-resiko', { name: 'reviewer-2-resiko', level: 'multi'}],
	['approver-resiko', { name: 'approver-resiko', level: 'multi'}],
	['creator-pembina', { name: 'creator-pembina', level: 'multi'}],
	['reviewer-1-pembina', { name: 'reviewer-1-pembina', level: 'multi'}],
	['reviewer-2-pembina', { name: 'reviewer-2-pembina', level: 'multi'}],
	['approver-pembina', { name: 'approver-pembina', level: 'multi'}],
	['creator-kepatuhan', { name: 'creator-kepatuhan', level: 'multi'}],
	['reviewer-1-kepatuhan', { name: 'reviewer-1-kepatuhan', level: 'multi'}],
	['reviewer-2-kepatuhan', { name: 'reviewer-2-kepatuhan', level: 'multi'}],
	['approver-kepatuhan', { name: 'approver-kepatuhan', level: 'multi'}],
	['creator-setper', { name: 'creator-setper', level: 'multi'}],
	['reviewer-1-setper', { name: 'reviewer-1-setper', level: 'multi'}],
	['reviewer-2-setper', { name: 'reviewer-2-setper', level: 'multi'}],
	['approver-setper', { name: 'approver-setper', level: 'multi'}],
	['creator-pusat', { name: 'creator-pusat', level: 'multi'}],
	['reviewer-1-pusat', { name: 'reviewer-1-pusat', level: 'multi'}],
	['reviewer-2-pusat', { name: 'reviewer-2-pusat', level: 'multi'}],
	['approver-pusat', { name: 'approver-pusat', level: 'multi'}],
	['creator-tp2dp', { name: 'creator-tp2dp', level: 'multi'}],
	['reviewer-tp2dp', { name: 'reviewer-tp2dp', level: 'multi'}],
	['approver-tp2dp', { name: 'approver-tp2dp', level: 'multi'}]
])

export function generateUserName(roleName: string, bussArea: string): string {
	return `${roleName.replaceAll('-', '_')}_${bussArea}`
}

export function generateCompanyCode(bussArea: string): string {
	return `${bussArea.slice(0, 2)}00`
}

export function generateQueryInsertUser(roleName: string, bussArea: string, hashedPassword: string, isWithDbId: boolean = false): string {
	const userName = generateUserName(roleName, bussArea)
	const name = userName.replaceAll('_', ' ').toUpperCase()

	return `INSERT INTO "USERS" (${isWithDbId ? '"ID", ' : ''}"USERNAME", "NAME", "EMAIL", "password", "ACTIVE_DIRECTORY", "STATUS", "CREATED_AT") VALUES (${isWithDbId ? `(SELECT NVL(MAX(ID), 0)+1 FROM "USERS"), ` : ''}'${userName}', '${name}', '${userName}@email.test', '${hashedPassword}', '0', 'ACTV', SYSTIMESTAMP);`
}

export function generateQueryAssignRole(roleName: string, bussArea: string): string {
	const userName = generateUserName(roleName, bussArea)

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

export function generateAllQuery(selectedRoles: string[], bussAreaLv2List: string[], bussAreaLv1: string, hashedPassword: string, isWithDbId: boolean) {
	let userInsertQueryList: string[] = []
	let assignRoleQueryList: string[] = []
	let assignBuseAreaQueryList: string[] = []
	let assignMultiQueryList: string[] = []

	selectedRoles.forEach(roleName => {
		const role = MASTER_ROLES.get(roleName)

		if (role) {
			const bussAreaList: string[] = role.level === '2' ? bussAreaLv2List : [bussAreaLv1];

			bussAreaList.forEach(rawBussArea => {
				const bussArea: string = rawBussArea.trim()

				userInsertQueryList.push(generateQueryInsertUser(role.name, bussArea, hashedPassword, isWithDbId))
				assignRoleQueryList.push(generateQueryAssignRole(role.name, bussArea))
				assignBuseAreaQueryList.push(generateQueryAssignBussArea(role.name, bussArea, isWithDbId))

				if (role.level === 'multi') {
					assignMultiQueryList.push(generateQueryAssignMultiCompany(role.name, bussArea))
				}
			});
		}
	})

	return {
		userInsertQueryList,
		assignRoleQueryList,
		assignBuseAreaQueryList,
		assignMultiQueryList
	}
}

export function exportStringToSqlFile(text: string): Promise<void> {
	return new Promise((resolve, reject) => {
		try {
			const blob = new Blob([text], { type: 'application/sql' });
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')

			a.setAttribute('href', url)
			a.setAttribute('download', `${Date.now()}.sql`);
			a.click()

			resolve()
		} catch (e) {
			reject(e)
		}
	})
}