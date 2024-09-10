import React from 'react';
import {Divider} from '@nextui-org/divider';
import {Link} from '@nextui-org/link';

export default async function Footer() {
    return (
        <footer className='w-full'>
            <Divider className='my-14 mt-10' />
            <div className='m-5'>
                <Link
                    href='https://twitter.com/aida_0710'
                    isBlock
                    showAnchorIcon
                    className='mb-3 text-medium font-normal'>
                    <p>© {new Date().getFullYear()} Masaki Aida. All Rights Reserved.</p>
                </Link>
            </div>
        </footer>
    );
}
