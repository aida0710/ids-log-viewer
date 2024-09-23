import {Button} from '@nextui-org/react';
import React from 'react';
import {IPaginationProps} from '@/app/index/interface/IPaginationProps';

export const PaginationControls: React.FC<IPaginationProps> = ({ currentPage, totalPages, isLoading, onPageChange }) => (
    <div className='my-2 flex items-center justify-between'>
        <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            color='default'
        >
            前へ
        </Button>
        <span>
            Page {currentPage} of {totalPages}
        </span>
        <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            color='default'
        >
            次へ
        </Button>
    </div>
);