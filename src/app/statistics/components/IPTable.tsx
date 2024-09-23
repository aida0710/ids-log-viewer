import React from 'react';
import {Card, CardBody, CardHeader} from '@nextui-org/card';
import {Divider} from '@nextui-org/divider';
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from '@nextui-org/table';

export const IPTable: React.FC<{ title: string; data: { ip: string; count: number }[] }> = ({ title, data }) => (
    <Card>
        <CardHeader>
            <h2 className='text-xl font-semibold'>{title}</h2>
        </CardHeader>
        <Divider />
        <CardBody>
            <Table aria-label={title}>
                <TableHeader>
                    <TableColumn>IP アドレス</TableColumn>
                    <TableColumn>パケット数</TableColumn>
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.ip}>
                            <TableCell>{item.ip}</TableCell>
                            <TableCell>{item.count.toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardBody>
    </Card>
);