import React from 'react';
import { CellContext } from '@tanstack/react-table';
import { BaseColumnSetting } from '@/types/table';
import { Company, Project, ProjectDisplay, Payment, PaymentDetail } from '@/types/company';
import { Link } from '@tanstack/react-router';
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';

// Memoized Image Cell component
const CompanyLogoCell = memo(({ row }: { row: any }) => (
	<div className="flex items-center justify-start h-full">
		<figure className="w-10 h-10 overflow-hidden">
			<img
				className="object-cover w-full h-full"
				src={row.original.logo || '/default-avatar.png'}
				alt={`${row.original.name} logo`}
			/>
		</figure>
	</div>
));
CompanyLogoCell.displayName = 'CompanyLogoCell';

export const defaultCompanyColumnSettings: BaseColumnSetting<Company>[] = [
	{
		accessorKey: 'logo',
		header: '',
		label: '',
		type: 'image',
		date_created: new Date().toISOString(),
		status: 'Active',
		order: 1,
		cell: ({ row }: CellContext<Company, any>) => <CompanyLogoCell row={row} />,
	},
	{
		accessorKey: 'companyid',
		header: 'ID',
		label: 'ID',
		type: 'number',
		date_created: new Date().toISOString(),
		status: 'Active',
		order: 2,
	},
	{
		accessorKey: 'name',
		header: 'Company',
		label: 'Company',
		type: 'text',
		date_created: new Date().toISOString(),
		status: 'Active',
		order: 3,
	},
	{
		accessorKey: 'personnel',
		header: 'Personnel No.',
		label: 'Personnel No.',
		type: 'number',
		date_created: new Date().toISOString(),
		status: 'Active',
		order: 4,
		cell: ({ row }: CellContext<Company, any>) => <div className="flex items-center justify-start h-full">{row.original.personnel?.length}</div>,
	},
	{
		accessorKey: 'category_group',
		header: 'Category Group',
		label: 'Category Group',
		type: 'text',
		date_created: new Date().toISOString(),
		status: 'Active',
		order: 5,
	},
	{
		accessorKey: 'city',
		header: 'Cities',
		label: 'Cities',
		type: 'text',
		date_created: new Date().toISOString(),
		status: 'Active',
		order: 6,
	},
	{
		accessorKey: 'created_at', // Type assertion
		header: 'Created at',
		label: 'Created at',
		type: 'date',
		date_created: new Date().toISOString(),
		status: 'Active',
		order: 7,
	},
	{
		accessorKey: 'managerid',
		header: 'Manager',
		label: 'Manager',
		type: 'number',
		date_created: new Date().toISOString(),
		status: 'Active',
		order: 8,
	},
	{
		accessorKey: 'product',
		header: 'Product',
		label: 'Product',
		type: 'text',
		date_created: new Date().toISOString(),
		status: 'Active',
		order: 9,
	},
	{
		accessorKey: 'activeLeads',
		header: 'Active Leads',
		label: 'Active Leads',
		type: 'number',
		date_created: new Date().toISOString(),
		status: 'Active',
		order: 10,
	},
	{
		accessorKey: 'email',
		header: 'Email',
		label: 'Email',
		type: 'email',
		date_created: new Date().toISOString(),
		status: 'Active',
		order: 11,
	},
	{
		accessorKey: 'detail',
		header: 'View',
		type: 'text',
		date_created: new Date().toISOString(),
		status: 'Active',
		order: 12,
		cell: ({ row }: CellContext<Company, any>) => (
			<div className="flex justify-end w-full">
				<Link
					to={`/company/$companyId`}
					params={{
						companyId: row.original.companyid.toString(),
					}}>
					<Button
						variant="outline"
						className="w-20 h-full border">
						DETAIL
					</Button>
				</Link>
			</div>
		),
	},
];

// Project

const costColumns = Object.entries({
	revenue: 'Revenue',
	labour_cost: 'Labour Cost',
	transport_cost: 'Transport Cost',
	break: 'Break Cost',
	food: 'Food Cost',
	rental: 'Rental Cost',
	manager_fee: 'Manager Fee',
	costume_cost: 'Costume Cost',
	other_cost: 'Other Cost',
	sales_profit: 'Sales Profit',
}).map(([key, label], index) => ({
	accessorKey: `costs.${key}` as keyof ProjectDisplay,
	header: label,
	label: label,
	type: 'number' as const,
	date_created: new Date().toISOString(),
	status: 'shown' as const,
	order: 8 + index,
	cell: ({ row }: any) => {
		// Get the costs object safely
		const costs = row.original?.costs;
		// If costs exists, get the specific cost value, otherwise default to 0
		const value = costs ? (costs[key as keyof typeof costs] ?? 0) : 0;
		// Convert to number to ensure we can use toLocaleString
		const numericValue = Number(value);
		return <span>¥{numericValue.toLocaleString()}</span>;
	},
}));

export const defaultProjectColumnSettings: BaseColumnSetting<ProjectDisplay>[] = [
	{
		accessorKey: 'name',
		header: () => <h1 className="pl-8">Project Name</h1>,
		label: 'Project Name',
		type: 'text',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 1,
		cell: ({ row }) => <h1 className="pl-8">{row.original.name}</h1>,
	},
	{
		accessorKey: 'managerid', // Changed from "manager.name" to match Project type
		header: 'Manager',
		label: 'Manager',
		type: 'number',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 2,
		cell: ({ row }) => <span>{row.original.manager?.name}</span>, // Access nested property in cell renderer
	},
	{
		accessorKey: 'startDate', // Changed from startdate to startDate
		header: 'Starting',
		label: 'Starting',
		type: 'date',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 3,
		cell: ({ row }) => (row.original.startDate ? new Date(row.original.startDate).toLocaleDateString() : 'N/A'),
	},
	{
		accessorKey: 'endDate', // Changed from enddate to endDate
		header: 'End',
		label: 'End',
		type: 'date',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 4,
		cell: ({ row }) => (row.original.endDate ? new Date(row.original.endDate).toLocaleDateString() : 'N/A'),
	},
	{
		accessorKey: 'companyid', // Changed from company.name to match Project type
		header: 'Client Name',
		label: 'Client Name',
		type: 'number',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 5,
		cell: ({ row }) => <span>{row.original.company?.name}</span>, // Access nested property in cell renderer
	},
	{
		accessorKey: 'categoryid',
		header: 'Category',
		label: 'Category',
		type: 'text',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 6,
		cell: ({ row }) => <span>{row.original.category?.name}</span>,
	},
	{
		accessorKey: 'assignedStaff',
		header: 'Members',
		label: 'Members',
		type: 'text',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 7,
		cell: ({ row }) => {
			const personnelCount = Array.isArray(row.original.assignedStaff) ? row.original.assignedStaff.length : 0;
			return <span>{personnelCount}</span>;
		},
	},
	// Map through all cost types
	...costColumns,
	// Detail button always at the end
	{
		accessorKey: 'detail',
		header: '',
		label: '',
		type: 'text',
		date_created: new Date().toISOString(),
		status: 'shown',
		order: 99,
		cell: ({ row }) => (
			<div className="flex justify-end w-full">
				<div className="sticky right-0 bg-white">
					<Button
						variant="outline"
						className="w-20 border ">
						<Link
							to={`/projects/$projectId`}
							params={{
								projectId: row.original.projectId.toString(),
							}}>
							View
						</Link>
					</Button>
				</div>
			</div>
		),
	},
];

//Column for //Employee Page
export const defaultEmployeeColumnSettings: BaseColumnSetting<any>[] = [
	{
		accessorKey: 'profileimage',
		header: '',
		label: '',
		type: 'image',
		status: 'Active',
		order: 1,
		cell: ({ row }: any) => (
			<img
				className="object-cover w-10 h-10"
				src={
					row.original.profileimage ||
					'https://www.google.com/imgres?q=japanese%20face%20profile%20picture%20front&imgurl=https%3A%2F%2Fimg.freepik.com%2Ffree-photo%2Fkorean-young-woman-s-close-up-portrait-female-model-white-shirt-smiling-looking-happy-concept-human-emotions-facial-expression-front-view_155003-18251.jpg&imgrefurl=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fjapanese-face%2F4&docid=rKwtNPLSsXTDPM&tbnid=bsTG6-a_ygqFmM&vet=12ahUKEwjvzJXB_JKMAxX2zDgGHTg5CM8QM3oECE0QAA..i&w=626&h=417&hcb=2&itg=1&ved=2ahUKEwjvzJXB_JKMAxX2zDgGHTg5CM8QM3oECE0QAA'
				}
				alt={`${row.original.name}'s profile`}
			/>
		),
	},
	{
		accessorKey: 'employeeid',
		header: 'ID',
		label: 'ID',
		type: 'number',
		status: 'Active',
		order: 2,
		category: '基本情報',
		cell: ({ row }) => <h1>{row.original.employeeid}</h1>,
	},
	{
		accessorKey: 'name',
		header: 'フルネーム',
		label: 'フルネーム',
		type: 'text',
		status: 'Active',
		order: 3,
		category: '基本情報',
		cell: ({ row }: any) => (
			<Link
				to={'/employee/$userId'}
				params={{ userId: row.original.employeeid.toString() }}
				className="text-blue-600 hover:underline">
				{row.original.name || '-'}
			</Link>
		),
	},
	{
		accessorKey: 'employeecategoryid',
		header: 'カテゴリー',
		label: 'カテゴリー',
		type: 'number',
		status: 'Active',
		order: 4,
		category: '基本情報',
		cell: ({ row }: any) => row.original.employeeCategory?.categoryname || '-',
	},
	{
		accessorKey: 'email',
		header: 'メアド',
		label: 'メアド',
		type: 'email',
		status: 'Active',
		order: 5,
		category: '基本情報',
		cell: ({ row }: any) =>
			row.original.email ? (
				<a
					href={`mailto:${row.original.email}`}
					className="text-blue-600 hover:underline">
					{row.original.email}
				</a>
			) : (
				'-'
			),
	},
	{
		accessorKey: 'departmentid',
		header: '部署',
		label: '部署',
		type: 'text',
		status: 'Active',
		order: 6,
		category: '基本情報',
		cell: ({ row }: any) => row.original.department?.departmentname || '-',
	},
	{
		accessorKey: 'created at',
		header: '作成日',
		label: '作成日',
		type: 'date',
		status: 'Active',
		order: 10,
		category: '基本情報',
		cell: ({ row }: any) => row.original.createdAt || '-',
	},
	{
		accessorKey: 'status',
		header: 'ステータス',
		label: 'ステータス',
		type: 'text',
		status: 'Active',
		category: '基本情報',
		order: 11,
		cell: ({ row }: any) => row.original.statuss || '-',
	},
	{
		accessorKey: 'caterUnitPrice',
		header: 'ケーター単価',
		label: 'ケーター単価',
		type: 'number',
		status: 'Active',
		category: '単価',
		order: 12,
		cell: ({ row }: any) => row.original.caterUnitPrice || '-',
	},
	{
		accessorKey: 'foodWeddingUnitPrice',
		header: '飲食婚礼単価',
		label: '飲食婚礼単価',
		type: 'number',
		status: 'Active',
		category: '単価',
		order: 13,
		cell: ({ row }: any) => row.original.foodWeddingUnitPrice || '-',
	},
	{
		accessorKey: 'oldCaterUnitPrice',
		header: '旧）ケーター単価',
		label: '旧）ケーター単価',
		type: 'number',
		status: 'Active',
		category: '単価',
		order: 14,
		cell: ({ row }: any) => row.original.oldCaterUnitPrice || '-',
	},
	{
		accessorKey: 'oldFoodWeddingUnitPrice',
		header: '旧）飲食婚礼単価',
		label: '旧）飲食婚礼単価',
		type: 'number',
		status: 'Active',
		category: '単価',
		order: 15,
		cell: ({ row }: any) => row.original.oldFoodWeddingUnitPrice || '-',
	},
	{
		accessorKey: 'interview',
		header: '面接',
		label: '面接',
		type: 'boolean',
		status: 'Active',
		category: '契約関連',
		order: 16,
		cell: ({ row }: any) => row.original.interview || '-',
	},
	{
		accessorKey: 'cloudSign',
		header: 'クラウドサイン',
		label: 'クラウドサイン',
		type: 'boolean',
		status: 'Active',
		category: '契約関連',
		order: 17,
		cell: ({ row }: any) => row.original.cloudSign || '-',
	},
	{
		accessorKey: 'cloudSignPDF',
		header: 'クラウドサインPDF',
		label: 'クラウドサインPDF',
		type: 'file',
		status: 'Active',
		category: '契約関連',
		order: 18,
		cell: ({ row }: any) => row.original.cloudSignPDF || '-',
	},
	{
		accessorKey: 'mizuhoAccount',
		header: 'みずほ口座',
		label: 'みずほ口座',
		type: 'boolean',
		status: 'Active',
		category: '契約関連',
		order: 19,
		cell: ({ row }: any) => row.original.mizuhoAccount || '-',
	},
	{
		accessorKey: 'netBanking',
		header: 'ネットバンキング',
		label: 'ネットバンキング',
		type: 'boolean',
		status: 'Active',
		category: '契約関連',
		order: 20,
		cell: ({ row }: any) => row.original.netBanking || '-',
	},
	{
		accessorKey: 'idCard',
		header: '身分証',
		label: '身分証',
		type: 'boolean',
		status: 'Active',
		category: '契約関連',
		order: 21,
		cell: ({ row }: any) => row.original.idCard || '-',
	},
	{
		accessorKey: 'publicFee',
		header: '公料',
		label: '公料',
		type: 'boolean',
		status: 'Active',
		category: '契約関連',
		order: 22,
		cell: ({ row }: any) => row.original.publicFee || '-',
	},
	{
		accessorKey: 'otherCompanyWork',
		header: '他社勤労',
		label: '他社勤労',
		type: 'boolean',
		status: 'Active',
		category: '契約関連',
		order: 23,
		cell: ({ row }: any) => row.original.otherCompanyWork || '-',
	},
	{
		accessorKey: 'emergencyContact',
		header: '緊急連絡',
		label: '緊急連絡',
		type: 'boolean',
		status: 'Active',
		category: '契約関連',
		order: 24,
		cell: ({ row }: any) => row.original.emergencyContact || '-',
	},
	{
		accessorKey: 'restaurantVisits',
		header: '飲食店回数',
		label: '飲食店回数',
		type: 'number',
		status: 'Active',
		category: '契約関連',
		order: 25,
		cell: ({ row }: any) => row.original.restaurantVisits || '-',
	},
	{
		accessorKey: 'date',
		header: '日付',
		label: '日付',
		type: 'date',
		status: 'Active',
		category: '面談結果',
		order: 26,
		cell: ({ row }: any) => row.original.date || '-',
	},
	{
		accessorKey: 'visual',
		header: 'ビジュアル',
		label: 'ビジュアル',
		type: 'number',
		status: 'Active',
		category: '面談結果',
		order: 27,
		cell: ({ row }: any) => row.original.visual || '-',
	},
	{
		accessorKey: 'communication',
		header: 'コミュ力',
		label: 'コミュ力',
		type: 'number',
		status: 'Active',
		category: '面談結果',
		order: 28,
		cell: ({ row }: any) => row.original.communication || '-',
	},
	{
		accessorKey: 'sense',
		header: 'センス',
		label: 'センス',
		type: 'number',
		status: 'Active',
		category: '面談結果',
		order: 29,
		cell: ({ row }: any) => row.original.sense || '-',
	},
	{
		accessorKey: 'height',
		header: '身長',
		label: '身長',
		type: 'number',
		status: 'Active',
		category: '面談結果',
		order: 30,
		cell: ({ row }: any) => row.original.height || '-',
	},
	{
		accessorKey: 'age',
		header: '年齢',
		label: '年齢',
		type: 'number',
		status: 'Active',
		category: '面談結果',
		order: 31,
		cell: ({ row }: any) => row.original.age || '-',
	},
	{
		accessorKey: 'personality',
		header: '性格',
		label: '性格',
		type: 'number',
		status: 'Active',
		category: '面談結果',
		order: 32,
		cell: ({ row }: any) => row.original.personality || '-',
	},
	{
		accessorKey: 'intelligence',
		header: '賢さ',
		label: '賢さ',
		type: 'number',
		status: 'Active',
		category: '面談結果',
		order: 33,
		cell: ({ row }: any) => row.original.intelligence || '-',
	},
	{
		accessorKey: 'hairStyle',
		header: '髪型',
		label: '髪型',
		type: 'number',
		status: 'Active',
		category: '面談結果',
		order: 34,
		cell: ({ row }: any) => row.original.hairStyle || '-',
	},
	{
		accessorKey: 'totalScoreByStaff',
		header: '総合評価（事務員）',
		label: '総合評価（事務員）',
		type: 'number',
		status: 'Active',
		category: '面談結果',
		order: 35,
		cell: ({ row }: any) => row.original.totalScoreByStaff || '-',
	},
	{
		accessorKey: 'totalScoreByOthers',
		header: '総合評価（その他）',
		label: '総合評価（その他）',
		type: 'number',
		status: 'Active',
		category: '面談結果',
		order: 36,
		cell: ({ row }: any) => row.original.totalScoreByOthers || '-',
	},
	{
		accessorKey: 'feelingScoreStaff',
		header: '印象（事務員）',
		label: '印象（事務員）',
		type: 'text',
		status: 'Active',
		category: '面談結果',
		order: 37,
		cell: ({ row }: any) => row.original.feelingScoreStaff || '-',
	},
	{
		accessorKey: 'feelingScoreOta',
		header: '印象（太田）',
		label: '印象（太田）',
		type: 'text',
		status: 'Active',
		category: '面談結果',
		order: 38,
		cell: ({ row }: any) => row.original.feelingScoreOta || '-',
	},
	{
		accessorKey: 'feelingScoreTomita',
		header: '印象（冨田）',
		label: '印象（冨田）',
		type: 'text',
		status: 'Active',
		category: '面談結果',
		order: 39,
		cell: ({ row }: any) => row.original.feelingScoreTomita || '-',
	},
	{
		accessorKey: 'feelingScoreFukuyama',
		header: '印象（福山）',
		label: '印象（福山）',
		type: 'text',
		status: 'Active',
		category: '面談結果',
		order: 40,
		cell: ({ row }: any) => row.original.feelingScoreFukuyama || '-',
	},
	{
		accessorKey: 'remarks',
		header: '備考',
		label: '備考',
		type: 'text',
		status: 'Active',
		category: '面談結果',
		order: 41,
		cell: ({ row }: any) => row.original.remarks || '-',
	},
	{
		accessorKey: 'instagram',
		header: 'IG',
		label: 'IG',
		type: 'text',
		status: 'Active',
		category: 'SNS',
		order: 42,
		cell: ({ row }: any) => row.original.instagram || '-',
	},
	{
		accessorKey: 'tiktok',
		header: 'Tiktok',
		label: 'Tiktok',
		type: 'text',
		status: 'Active',
		category: 'SNS',
		order: 43,
		cell: ({ row }: any) => row.original.tiktok || '-',
	},
	{
		accessorKey: 'facebook',
		header: 'Facebook',
		label: 'Facebook',
		type: 'text',
		status: 'Active',
		category: 'SNS',
		order: 44,
		cell: ({ row }: any) => row.original.facebook || '-',
	},
	{
		accessorKey: 'x',
		header: 'X',
		label: 'X',
		type: 'text',
		status: 'Active',
		category: 'SNS',
		order: 45,
		cell: ({ row }: any) => row.original.x || '-',
	},
	{
		accessorKey: 'actions',
		header: '',
		label: '',
		type: 'text',
		status: 'Active',
		order: 46,
		cell: ({ row }) => (
			<div className="flex justify-end w-full">
				<Link
					to={'/employee/$userId'}
					className="sticky"
					params={{ userId: row.original.employeeid.toString() }}>
					<Button
						variant="outline"
						className="w-20 border-t-0 border-b border-r-0">
						DETAIL
					</Button>
				</Link>
			</div>
		),
	},
];

export const defaultPaymentColumnSettings: BaseColumnSetting<any>[] = [
	{
		accessorKey: 'name',
		header: 'Employee Name',
		label: 'Employee Name',
		type: 'text',
		date_created: new Date().toISOString(),
		status: 'Active',
		order: 1,
	},
	{
		accessorKey: 'break',
		header: 'Break',
		label: 'Break',
		type: 'number',
		date_created: new Date().toISOString(),
		status: 'Active',
		order: 2,
		cell: ({ row }) => {
			const details = row.original.employee?.details[0];
			return details?.break || 0;
		},
	},
	{
		accessorKey: 'duration',
		header: 'Duration',
		label: 'Duration',
		type: 'text',
		date_created: new Date().toISOString(),
		status: 'Active',
		order: 3,
		cell: ({ row }) => {
			console.log('Current row data:', row.original);
			// If duration is provided directly
			if (typeof row.original.duration === 'number') {
				return `${row.original.duration} days`;
			}
			return '-';
		},
	},
	{
		accessorKey: 'hourlyRate',
		header: 'Hour Rate',
		type: 'number',
		label: 'Hour Rate',
		date_created: new Date().toISOString(),
		status: 'Active',
		order: 4,
		cell: ({ row }) => {
			const employee = row.original.employee;
			const rate = employee?.rates?.find((r) => r.type === 'A')?.ratevalue || employee?.rates?.find((r) => r.type === 'B')?.ratevalue || 0;
			return `¥${rate}`;
		},
	},
	{
		accessorKey: 'totalFee',
		header: 'Total Fee',
		label: 'Total Fee',
		type: 'number',
		date_created: new Date().toISOString(),
		status: 'Active',
		order: 5 + costColumns.length + 1,
		cell: ({ row }) => {
			return `¥${row.original.totalFee}`;
		},
	},

	{
		accessorKey: 'detail',
		header: '',
		label: '',
		type: 'text',
		date_created: new Date().toISOString(),
		status: 'Active',
		order: 99,
		cell: ({ row }) => {
			// Get the ID safely with fallback
			const projectId = row.original?.projectId || row.original?.project?.projectId || '';

			return (
				<div className="flex justify-end w-full">
					<div className="sticky right-0 bg-white">
						<Button
							variant="outline"
							className="w-20 border">
							<Link
								to={`/projects/$projectId`}
								params={{
									projectId: projectId.toString(),
								}}>
								View
							</Link>
						</Button>
					</div>
				</div>
			);
		},
	},
];
