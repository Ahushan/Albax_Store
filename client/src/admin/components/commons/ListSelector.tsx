import api from "@/api/API";
import React from "react";

interface ListSelectorProps {
  Url: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const ListSelector = ({
  Url,
  value,
  onChange,
  placeholder,
}: ListSelectorProps) => {
  const [list, setList] = React.useState([]);

  React.useEffect(() => {
    const fetchList = async () => {
      const response = await api.get(Url);
      setList(response.data);
    };
    fetchList();
  }, [Url]);

  return (
    <>
      <section>
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">{placeholder}</option>
          {list.map((item: any) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </section>
    </>
  );
};

export default ListSelector;
