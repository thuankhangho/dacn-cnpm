import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from "@/shadcn/ui/button";
import { QB } from "../QuestionBank/QuestionBankType";
import { QPage, Question } from "../Questions/QuestionType";
// import { PlusIcon } from "lucide-react";
import QBLayout from "@/Layouts/QBLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/shadcn/ui/pagination";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/shadcn/ui/card"
import { Separator } from "@/shadcn/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shadcn/ui/accordion"
import { Input } from "@/shadcn/ui/input";
import { CheckCircledIcon, ChevronLeftIcon, FileIcon, PlusIcon } from "@radix-ui/react-icons";
import { Test } from "./TestTable/TestType";

export default function QuestionList({ auth, QBank, questions, test }: PageProps<{ QBank: QB, questions: QPage, test: Test }>) {
  // console.log(JSON.stringify(questions.data[2].inTest));
  return (
    <QBLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">All Questions</h2>} QBank={QBank} CanEdit={true}>
      <Head title="Questions" />
      <div className="py-12">
        <div className="container mx-auto">
          <Card className="mb-5 md:col-start-10 col-span-1 pt-2">
            <CardContent>
            <Link href={route('tests.show', [test.question_bank_id, test.id])} className="flex items-center gap-2">
                  <ChevronLeftIcon/> Return to the test {test.name}
              </Link>
              <Link href={route('questions.create', QBank.id)} className="flex justify-end">
                <Button>
                  <PlusIcon className="mr-3" /> Add question
                </Button>
              </Link>
              <Separator className="mb-3 mt-2" />
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search for a question..."
                  className="border-2 border-blue-500 border-solid" />
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alphabetical">Alphabetical</SelectItem>
                    <SelectItem value="Last Updated">Last Updated</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="l01">L.0.1</SelectItem>
                    <SelectItem value="l02">L.0.2</SelectItem>
                    <SelectItem value="l03">L.0.3</SelectItem>
                    <SelectItem value="l04">L.0.4</SelectItem>
                    <SelectItem value="l05">L.0.5</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>
          <Accordion type="single" collapsible className="w-full shadow-2xl bg-white">
            {questions.data.map((question: Question) => (
              <AccordionItem value={question.id as unknown as string}>
                {question.inTest == true ?
                  <AccordionTrigger className="flex hover:bg-blue-100 bg-green-300 px-3">
                    <div className="flex gap-2 items-center"><FileIcon />
                      {question.question as string}
                    </div>
                  </AccordionTrigger>
                  :
                  <AccordionTrigger className="hover:bg-blue-100 bg-white px-3">
                    <div className="flex gap-2 items-center"><FileIcon />{question.question as string}
                    </div>
                  </AccordionTrigger>
                }
                <AccordionContent className="bg-white px-3">
                  <p>Created at: {question.created_at}</p>
                  <p>Updated at: {question.updated_at}</p>
                  <Separator className="mb-2 mt-2" />
                  <p>Answer 1: {question.ans1}</p>
                  <p>Answer 2: {question.ans2}</p>
                  <p>Answer 3: {question.ans3}</p>
                  <p className="flex gap-2 font-bold items-center text-green-500">Answer 4: {question.ans4} <CheckCircledIcon /> </p>
                  <p>Answer 5: {question.ans5}</p>
                  <p>Answer 6: {question.ans6}</p>
                  <Separator className="mb-2 mt-2" />
                  <div className="flex gap-4">
                    {question.inTest == true ?
                      <Link href={route('tests.detachQuestion', [QBank.id, test.id])} method="put" data={{qID: question.id}}>
                        <p className="text-lg font-bold underline text-indianred">Delete from test</p>
                        </Link>
                      :
                      <Link href={route('tests.attachQuestion', [QBank.id, test.id])} method="post" data={{qID: question.id}}>
                        <Button>
                          Add question to Test
                        </Button>
                      </Link>
                    }
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
            )}
            <Pagination className="bg-white mt-2">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href={questions.prev_page_url} />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href={questions.first_page_url}>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href={questions.next_page_url} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </Accordion>
        </div>
      </div>
    </QBLayout>
  );
}
