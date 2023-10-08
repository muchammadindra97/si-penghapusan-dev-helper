import {Anchor, Box, Breadcrumbs, Container, Grid, Title} from "@mantine/core";
import {ReactNode} from "react";
import Link from "next/link";

export default function LayoutDefault({ children }: { children: ReactNode }) {
	return (
		<Box bg="#3C97A0" mih="100vh" pt="1rem" pb="1rem">
			<Container>
				<Grid gutter="md">
					<Grid.Col>
						<Title c="white">SI Penghapusan Dev Helper</Title>
					</Grid.Col>
					<Grid.Col>
						<Breadcrumbs>
							<Anchor component={Link} href="/" c="#DBD33E" fw="bold">Home</Anchor>
						</Breadcrumbs>
					</Grid.Col>
					<Grid.Col>
						{ children }
					</Grid.Col>
				</Grid>
			</Container>
		</Box>
	)
}
