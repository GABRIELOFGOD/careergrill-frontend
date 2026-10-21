import Container from "../container";
import { Eyebrow } from "../site-shell";

const PageHeader = ({
  title,
  description,
  header
}: {
  title: string;
  description?: string;
  header: string;
}) => {
  return (
    <div className="bg-brand-sage">
      <Container>
        <div className="grid grid-cols-2 gap-4 py-5">
        <div className="flex flex-col gap-2 py-12">
          <Eyebrow>{header}</Eyebrow>
          <h1 className="mb-3 text-6xl tracking-tight font-extrabold">{title}</h1>
          {description && <p className="mb-0 text-lg text-brand-muted">{description}</p>}
        </div>
        </div>
      </Container>

    </div>
  )
}

export default PageHeader;