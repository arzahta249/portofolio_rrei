import { ProjectDetailPage } from "../../components/project-detail-page";

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ProjectDetailPage projectId={id} />;
}
