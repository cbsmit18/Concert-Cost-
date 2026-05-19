import { ui } from "@/lib/ui-classes";



export function PageHeader({

  title,

  description,

}: {

  title: string;

  description: string;

}) {

  return (

    <header className="mb-8 border-b border-base-300 pb-6">

      <h1 className={ui.pageTitle}>{title}</h1>

      <p className={`mt-2 ${ui.bodyText} max-w-2xl`}>{description}</p>

    </header>

  );

}

