import Link from "next/link";
import Image from "next/image";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { SearchInput } from "./search-input";

export const NavbarDesktop = () => {
    return (
        <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[1200px] flex items-center justify-between bg-white/80 backdrop-blur-md shadow-xl z-50 rounded-full px-6 py-3">
            <div className="flex gap-3 items-center shrink-0">
                <Link href="/">
                    <Image src="/logo.svg" alt="Logo" width={36} height={36} />
                </Link>
                <h3 className="text-xl font-semibold">Hyper Docs</h3>
            </div>

            <SearchInput />

            <div className="flex gap-3 items-center">
                <OrganizationSwitcher
                    afterCreateOrganizationUrl="/"
                    afterLeaveOrganizationUrl="/"
                    afterSelectOrganizationUrl="/"
                    afterSelectPersonalUrl="/"
                />
                <UserButton />
            </div>
        </nav>
    );
};

export const NavbarMobile = () => {
    return (
        <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[1200px] flex flex-col gap-4 items-center bg-white/80 backdrop-blur-md shadow-xl z-50 rounded-xl px-6 py-3">
            {/* Top row: Icon, Organization Switcher, and User Button */}
            <div className="w-full flex justify-between items-center gap-3">
                <Link href="/">
                    <Image src="/logo.svg" alt="Logo" width={36} height={36} />
                </Link>

                <div className="flex gap-3 items-center">
                    <OrganizationSwitcher 
                        afterCreateOrganizationUrl="/"
                        afterLeaveOrganizationUrl="/"
                        afterSelectOrganizationUrl="/"
                        afterSelectPersonalUrl="/"
                    />
                    <UserButton />
                </div>
            </div>

            {/* Second row: Search Input with full width */}
            <div className="w-full">
                <SearchInput />
            </div>
        </nav>
    );
};
