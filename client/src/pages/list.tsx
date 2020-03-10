import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ListSummary, LoadingStates } from '../models';

const API_URL = process.env.API_URL;

export const List: FC = () => {
  const { slug } = useParams();
  const [list, setList] = useState<ListSummary | null>(null);
  const [state, setState] = useState<LoadingStates>(LoadingStates.initial);

  const fetchList = async () => {
    try {
      setState(LoadingStates.loading);
      const res = await fetch(`${API_URL}/lists?slug=${slug}`);
      if (res.status !== 200) {
        throw new Error();
      }
      const listWithItems: ListSummary = await res.json();
      setList(listWithItems);
      setState(LoadingStates.loaded);
    } catch (error) {
      console.error(error);
      setList(null);
      setState(LoadingStates.error);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchList();
    }
  }, [slug]);

  if (state === 'loading' || state === 'initial') {
    return <div>fetching {slug}...</div>;
  }

  if (state === 'error') {
    return <div>error!</div>;
  }

  if (!list) return null;

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
