import type { ReactNode } from "react";
import Container from "../container";
import { Eyebrow } from "../site-shell";

const PageHeader = ({
  title,
  description,
  header
}: {
  title: ReactNode;
  description?: string;
  header: string;
}) => {
  return (
    <section className="page-header">
      <Container className="page-header-inner">
        <div className="page-header-content flex flex-col">
          <Eyebrow>{header}</Eyebrow>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
      </Container>
    </section>
  )
}

export default PageHeader;