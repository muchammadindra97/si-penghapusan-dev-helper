import LayoutDefault from "@/layouts/LayoutDefault";
import {NavLink} from "@mantine/core";
import Link from "next/link";
import {IconChevronRight} from "@tabler/icons-react";
import ContentContainer from "@/components/ContentContainer";

export default function Home() {
  return (
    <LayoutDefault>
      <ContentContainer title="Menu">
        <NavLink component={Link} href="/user-creator" label="User Creator" leftSection={<IconChevronRight size="1rem" stroke={1.5} />}/>
        <NavLink component={Link} href="/user-creator-bulk" label="User Creator Bulk by Buss Area List" leftSection={<IconChevronRight size="1rem" stroke={1.5} />}/>
        <NavLink component={Link} href="/aset-sap-generator" label="Sample Aset SAP Generator" leftSection={<IconChevronRight size="1rem" stroke={1.5} />} />
      </ContentContainer>
    </LayoutDefault>
  )
}
