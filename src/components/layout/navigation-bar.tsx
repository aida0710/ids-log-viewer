'use client';

import {Link} from '@nextui-org/link';
import {Button, Navbar, NavbarBrand, NavbarContent} from '@nextui-org/react';
import React from 'react';
import {ThemeButton} from '@/components/layout/theme-button';
import {ProjectIcon} from '@/components/icons/project-icon';
import {AppWindowIcon, ChartPieIcon} from 'lucide-react';
import ProjectCardModal from '@/components/layout/project-link-modal';

export const NavigationBar = () => {
    return (
        <Navbar isBordered>
            <NavbarContent>
                <NavbarBrand>
                    <Link
                        color='foreground'
                        href='/'>
                        <ProjectIcon />
                        <p className='ml-5 text-large font-bold text-inherit'>NIDS Log Viewer</p>
                    </Link>
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent justify='end'>
                <Link href='/'>
                    <Button
                        color='success'
                        startContent={<AppWindowIcon />}
                        variant='flat'>
                        Packet Logs
                    </Button>
                </Link>
                <Link href='/statistics'>
                    <Button
                        color='warning'
                        startContent={<ChartPieIcon />}
                        variant='flat'>
                        Statistics
                    </Button>
                </Link>
                <ProjectCardModal />
                <ThemeButton />
            </NavbarContent>
        </Navbar>
    );
};
