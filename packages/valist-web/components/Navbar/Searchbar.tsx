import { useState } from 'react';
import { useRouter } from 'next/router';
import { TextInput } from '@mantine/core';
import { Search } from 'tabler-icons-react';

export default function SearchBar(): JSX.Element {
  const router = useRouter();
  const [searchInput, setSearchInput ] = useState("");

  return (
    <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6">
      <div className="flex items-center px-6 py-4 md:max-w-3xl md:mx-auto lg:max-w-none lg:mx-0 xl:px-0">
        <div className="w-full">
          <TextInput
            radius="md" 
            size="md"
            placeholder='Search projects'
            icon={<Search size={18} strokeWidth={3} />}
            onChange={(e) => {setSearchInput(e.target.value);}}
            onKeyPress={(e) => {(e.key === 'Enter' && router.push(`/search/${searchInput}`));}}
          />
        </div>
      </div>
    </div>
  );
};