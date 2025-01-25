'use client'
import { Category } from '@/sanity.types'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Popover, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { Check, ChevronsUpDown } from 'lucide-react'
import { PopoverContent } from '@radix-ui/react-popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command'
import { cn } from '@/lib/utils'

const CategorySelectors = ({ categorise }: { categorise: Category[] }) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState('')
    const router = useRouter()
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant={`outline`} role='combobox' aria-expanded={open} className='w-[200px] justify-between'>
                    {value ? categorise.find((category) => category?._id === value)?.title : 'Filter by category'}
                    <ChevronsUpDown />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0 z-50'>
                <Command>
                    <CommandInput placeholder='search category...' className='h-9'
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const selectedCategory = categorise.find((c) => c.title?.toLowerCase().includes(e.currentTarget.value.toLowerCase())
                                );
                                if (selectedCategory?.slug?.current) {
                                    setValue(selectedCategory?._id);
                                    router.push(`categorise/${selectedCategory?.slug?.current}`);
                                    setOpen(false)
                                }
                            }
                        }}
                    />
                    <CommandList>
                        <CommandEmpty>No Category Found.</CommandEmpty>
                        <CommandGroup>
                            {categorise?.map((category) => (
                                <CommandItem key={category?._id} value={category?.title} onSelect={() => {
                                    setValue(value === category?._id ? category?._id : "");
                                    router.push(`/categorise/${category?.slug?.current}`);
                                    setOpen(false)
                                }}>
                                    {category?.title}
                                    <Check className={cn(`ml-auto `, value === category?._id ? 'opacity-100' : 'opacity-0')} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default CategorySelectors