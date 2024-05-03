import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/shadcn/ui/pagination";

export function PaginationProp({
    totalPosts,
    postsPerPage,
    currentPage,
    setCurrentPage,
    next_url,
    prev_url,
    links
  }: {
    totalPosts: any;
    postsPerPage: any;
    currentPage: any;
    setCurrentPage: any;
    next_url: any;
    prev_url: any;
    links: any;
  }) {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
      pageNumbers.push(i);
    }

    const maxPageNum = 5; // Maximum page numbers to display at once
    const pageNumLimit = Math.floor(maxPageNum / 2); // Current page should be in the middle if possible

    let activePages = pageNumbers.slice(
      Math.max(0, currentPage - 1 - pageNumLimit),
      Math.min(currentPage - 1 + pageNumLimit + 1, pageNumbers.length)
    );

    const handleNextPage = () => {
      if (currentPage < pageNumbers.length) {
        setCurrentPage(currentPage + 1);
      }
    };

    const handlePrevPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };

    // Function to render page numbers with ellipsis
    const renderPages = () => {
      const renderedPages = activePages.map((page, idx) => (
        <PaginationItem
          key={idx}
          className={currentPage === page && links[idx].active ? "bg-neutral-100 rounded-md" : ""}
        >
          <PaginationLink href = {links[idx].url} onClick={() => setCurrentPage(page)}>
            {page}
          </PaginationLink>
        </PaginationItem>
      ));

      // Add ellipsis at the start if necessary
      if (activePages[0] > 1) {
        renderedPages.unshift(
          <PaginationEllipsis
            key="ellipsis-start"
            onClick={() => setCurrentPage(activePages[0] - 1)}
          />
        );
      }

      // Add ellipsis at the end if necessary
      if (activePages[activePages.length - 1] < pageNumbers.length) {
        renderedPages.push(
          <PaginationEllipsis
            key="ellipsis-end"
            onClick={() =>
              setCurrentPage(activePages[activePages.length - 1] + 1)
            }
          />
        );
      }

      return renderedPages;
    };

    return (
      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={prev_url} onClick={handlePrevPage} />
            </PaginationItem>

            {renderPages()}

            <PaginationItem>
              <PaginationNext href={next_url} onClick={handleNextPage} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  }
