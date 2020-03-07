import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ListSummary } from '../models';

const API_URL = process.env.API_URL;

export const List: FC = () => {
  const { slug } = useParams();
  const [list, setList] = useState<ListSummary | null>(null);

  const fetchList = async () => {
    try {
      const res = await fetch(`${API_URL}/lists?slug=${slug}`);
      const listWithItems: ListSummary = await res.json();
      setList(listWithItems);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchList();
    }
  }, [slug]);

  if (!list) {
    return <div>fetching {slug}...</div>;
  }

  return (
    <div>
      <div>
        <strong>items: </strong>
        {list.itemsCount}
      </div>

      <br />

      <div>
        {Object.entries(list.progress!.stages).map(([key, value]) => (
          <div>
            stage {key}: {value} items
          </div>
        ))}
      </div>
    </div>
  );
};
