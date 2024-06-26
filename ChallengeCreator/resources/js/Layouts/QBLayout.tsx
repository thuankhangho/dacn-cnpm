import { useState, PropsWithChildren, ReactNode, useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import { User } from '@/types';

import logo from '../Pages/logo.png'
import { QB } from '@/Pages/QuestionBank/QuestionBankType';

import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/shadcn/ui/alert-dialog"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shadcn/ui/alert"
import { Button } from '@/shadcn/ui/button';
import { Toaster } from '@/shadcn/ui/toaster';




export default function QBLayout({ user, header, children, QBank, CanEdit }: PropsWithChildren<{ user: User, header?: ReactNode, QBank: QB, CanEdit: Boolean }>) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    useEffect(() => {
        const name = `qb.${QBank.id}.general`;
        const privateChannel = window.Echo.private(name);
        privateChannel.listen('MemberOut', (e:any) => {
                if(user.id == e.member.id){
                    setOpenAlert(true);
                  }
                console.log(e);
        });

    },[]);
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    {/* <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" /> */}
                                    <img className="block h-9 w-auto fill-current text-gray-800" src={logo} />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {/* <NavLink href={route('questionbanks.index')} active={route().current('questionbanks.index')}>
                                    Dashboard
                                </NavLink> */}

                                <NavLink href={route('tests.index', QBank.id)} active={route().current('tests.index', QBank.id)}>
                                    Tests
                                </NavLink>

                                <NavLink href={route('questions.index', QBank.id)} active={route().current('questions.index', QBank.id)}>
                                    Questions
                                </NavLink>

                                <NavLink href={route('labels.index', QBank.id)} active={route().current('labels.index', QBank.id)}>
                                    Labels
                                </NavLink>

                                <NavLink href={route('members.index', QBank.id)} active={route().current('members.index', QBank.id)}>
                                    Members
                                </NavLink>

                                {CanEdit == true ?
                                    <NavLink href={route('questionbanks.edit', QBank.id)} active={route().current('questionbanks.edit', QBank.id)}>
                                        Settings
                                    </NavLink>
                                    :
                                    undefined
                                }

                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}

                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('questionbanks.index')} active={route().current('questionbanks.index')}>
                            Dashboard
                        </ResponsiveNavLink>

                        <ResponsiveNavLink href={route('tests.index', QBank.id)} active={route().current('tests.index', QBank.id)}>
                            Tests
                        </ResponsiveNavLink>

                        <ResponsiveNavLink href={route('questions.index', QBank.id)} active={route().current('questions.index', QBank.id)}>
                            Questions
                        </ResponsiveNavLink>

                        <ResponsiveNavLink href={route('labels.index', QBank.id)} active={route().current('labels.index', QBank.id)}>
                            Labels
                        </ResponsiveNavLink>

                        <ResponsiveNavLink href={route('members.index', QBank.id)} active={route().current('members.index', QBank.id)}>
                            Members
                        </ResponsiveNavLink>

                        {CanEdit == true ?
                            <ResponsiveNavLink href={route('questionbanks.edit', QBank.id)} active={route().current('questionbanks.edit', QBank.id)}>
                                Settings
                            </ResponsiveNavLink>
                            :
                            undefined
                        }
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">
                                {user.name}
                            </div>
                            <div className="font-medium text-sm text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
            <Toaster />
            <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Something is wrong</AlertDialogTitle>
                            <AlertDialogDescription>
                                Your permission in this Question Bank has been revoked. Please contact the owner for more information.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <Button> <a href={route("questionbanks.index")}>Back to the dashboard</a></Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                </AlertDialog>
        </div>
    );
}
