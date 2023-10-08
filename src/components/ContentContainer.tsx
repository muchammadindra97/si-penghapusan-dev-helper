import {Card, Grid, Title} from "@mantine/core";
import {ReactNode} from "react";

export interface ContentContainerProps {
	children: ReactNode,
	title: string
}

export default function ContentContainer({ children, title}: ContentContainerProps) {
	return (
		<Card withBorder>
			<Grid>
				<Grid.Col>
					<Title order={2} size="h3">{title}</Title>
				</Grid.Col>
				<Grid.Col>
					{children}
				</Grid.Col>
			</Grid>
		</Card>
	)
}
