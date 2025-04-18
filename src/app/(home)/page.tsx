"use client";

import { usePaginatedQuery } from "convex/react";
import { useSearchParams } from "@/hooks/use-search-param";
import { NavbarDesktop, NavbarMobile } from "./navbar";
import { TemplatesGallery } from "./templates-gallery"; // New Floating Panel
import { DocumentsTable } from "./documents-table";
import { api } from "../../../convex/_generated/api";

const Home = () => {
  const [search] = useSearchParams();

  const { results, status, loadMore } = usePaginatedQuery(
    api.documents.get,
    { search },
    { initialNumItems: 5 }
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className=" md:block hidden">
        <NavbarDesktop />
      </div>
      <div className="sm:hidden">
        <NavbarMobile />
      </div>
      <TemplatesGallery />

      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto h-[calc(100vh-4rem)] pt-[15rem]">
        <DocumentsTable
          documents={results}
          loadMore={loadMore}
          status={status}
        />
      </main>
    </div>
  );
};

export default Home;
