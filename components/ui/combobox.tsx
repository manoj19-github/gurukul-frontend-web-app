"use client";

import { FC, useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ComboBoxProps {
  options: any[];
  keyName: string;
  valName: string;
  value?: string;
  onChange: (value: string) => void;
  placeHolder: string;
  noDataFound: string;
  searchPlaceholder: string;
}

export const ComboBox: FC<ComboBoxProps> = ({
  options,
  keyName,
  valName,
  value,
  placeHolder,
  onChange,
  noDataFound,
  searchPlaceholder,
}): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>("");
  useEffect(() => {
    if (!value || value.trim() === "") return;
    setUserInput(value);
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {userInput
            ? options.find((self) => self[valName] === userInput)[keyName]
            : placeHolder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="w-full">
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>{noDataFound}</CommandEmpty>
          <CommandGroup className="w-full">
            {options.map((self, index) => (
              <CommandItem
                key={index}
                value={self[keyName]}
                onSelect={() => {
                  //setValue(currentValue === value ? "" : currentValue);
                  onChange(self[valName] === userInput ? "" : self[valName]);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    userInput === self[valName] ? "opacity-100" : "opacity-0"
                  )}
                />
                {self[keyName]}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
