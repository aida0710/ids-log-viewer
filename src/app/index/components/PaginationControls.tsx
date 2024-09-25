import {Button} from '@nextui-org/react';
import React from 'react';
import {IPaginationProps} from '@/app/index/interface/IPaginationProps';

export const PaginationControls: React.FC<IPaginationProps> = ({log_length, currentPage, totalPages, isLoading, onPageChange}) => (
    <div className='my-2 flex items-center justify-between'>
        <Button
            onClick={() => onPageChange(currentPage - 1)}
            isDisabled={currentPage === 1 || isLoading}
            variant='flat'
            color='primary'>
            前へ
        </Button>
        <div className='flex flex-col items-center space-y-2'>
            <span>
                Page {currentPage} of {totalPages}
            </span>
            <span>Number of displayed logs {log_length}</span>
        </div>
        <Button
            onClick={() => onPageChange(currentPage + 1)}
            isDisabled={currentPage === totalPages || isLoading}
            variant='flat'
            color='primary'>
            次へ
        </Button>
    </div>
);
