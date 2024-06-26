import { columns } from "../Questions/QuestionTable/QuestionColumn"
import { DataTable } from "../Questions/QuestionTable/QuestionTable"
import { data } from "../Questions/QuestionTable/QuestionData"
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Menubar } from '@radix-ui/react-menubar';
import { Button } from "@/shadcn/ui/button";
import { Menu } from "../Menu";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/shadcn/ui/dropdown-menu";
import { UpdateIcon, PlusIcon, ShuffleIcon, FilePlusIcon } from "@radix-ui/react-icons";
import { Separator } from "@/shadcn/ui/separator";
import { QB } from "./QuestionBankType";
import QBLayout from "@/Layouts/QBLayout";

export default function QuestionBankPage({ auth, QBank, CanEdit }: PageProps<{ QBank: QB, CanEdit: Boolean }>) {
    // console.log(QBank)
    return (
        <QBLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Question bank - {QBank.name}</h2>} QBank={QBank} CanEdit={CanEdit}>
            <Head title="Question Bank" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1
                        className="inline-block text-5xl uppercase font-black !bg-clip-text text-transparent !bg-cover !bg-center"
                        style={{ background: "linear-gradient(to top right,#24C6DC,#514A9D)" }}
                    >
                        Welcome to your question bank
                    </h1>
                    <Separator className="mt-5 mb-5 bg-indianred"/>
                    <h4>A quick get started</h4>
                    <p className="text-xl font-bold mb-2 text-bluegreen">Tests</p> - See all your tests from this Bank
                    <p className="text-xl font-bold mt-2 mb-2 text-bluegreen">Questions</p> - See all your questions in this Bank
                    <p className="text-xl font-bold mt-2 mb-2 text-bluegreen">Labels</p> - See all the labels & sublabels for this Bank
                    <p className="text-xl font-bold mt-2 mb-2 text-bluegreen">Members</p> - See who are collaborating with you in this Bank
                    <p className="text-xl font-bold mt-2 mb-2 text-bluegreen">Settings</p> - Change information about this Bank
                </div>
            </div>
        </QBLayout>
    );
}
