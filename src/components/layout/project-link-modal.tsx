'use client';

import React from 'react';
import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from '@nextui-org/react';
import Link from 'next/link';
import {BsGithub} from 'react-icons/bs';

interface ILink {
    title: string;
    url: string;
    description: string;
}

export default function ProjectCardModal() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const links: ILink[] = [
        {
            title: 'NIDS Log Viewer',
            url: 'https://github.com/aida0710/ids-log-viewer',
            description: 'このサイトのGitHubリポジトリ',
        },
        {
            title: 'NIDS for Rust',
            url: 'https://github.com/aida0710/nids-for-rust',
            description: 'パケットを実際に傍受しているNIDSのGitHubリポジトリ',
        },
        {
            title: 'Portfolio',
            url: 'https://www.aida0710.work/',
            description: '開発者のポートフォリオサイト',
        },
    ];

    return (
        <>
            <Button
                className='block p-2'
                radius='full'
                isIconOnly
                variant='ghost'
                onClick={(): void => {
                    onOpen();
                }}>
                <BsGithub className='h-full w-full' />
            </Button>
            <Modal
                placement='center'
                isOpen={isOpen}
                onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Links</ModalHeader>
                            <ModalBody>
                                {Object.entries(links).map(([key, link]) => (
                                    <div>
                                        <Link
                                            target='_blank'
                                            key={key}
                                            className='block w-full'
                                            href={link.url}>
                                            <Button
                                                className='w-auto min-w-full h-full flex-col px-4 py-6 text-left'
                                                color='primary'
                                                variant='flat'>
                                                <h3 className='text-lg font-bold'>{link.title}</h3>
                                                <p className='text-default-600'>{link.description}</p>
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color='danger'
                                    variant='flat'
                                    onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
