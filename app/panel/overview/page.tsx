"use client";

import { useAlertContext } from "@/app/contexts/alert-context";
import { useQuery } from "react-query";
import TextWidget from "./widgets/text-widget";
import WidgetsHeader from "./components/widgets-header";
import ProgressWidget from "./widgets/progress-widget";
import { useHttpContext } from "@/app/contexts/http-context";

export default function OverviewPage() {
  const httpContext = useHttpContext()
  const widget_res = useQuery(
    "widgets",
    async () => {
      return await httpContext.httpClient.http_get_widgets();
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <main className="flex gap-4 flex-col px-6">
        <WidgetsHeader queryData={widget_res}/>
      <div className="flex gap-2 flex-col flex-wrap md:flex-row">
        {widget_res.data?.map((value) => {
          switch (value.type) {
            case 0:
              return (
                <TextWidget key={value.id} title={value.title} text={value.content.text} />
              );
            case 1:
              return(
                <ProgressWidget key={value.id} title={value.title} amont={value.content.amont} />
              )
          }
        })}
      </div>
    </main>
  );
}
