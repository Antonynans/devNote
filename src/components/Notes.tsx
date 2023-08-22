import { useState } from "react";
import Note from "./Note";
import ReactPaginate from "react-paginate";

interface Note {
  _id?: string | undefined;
  title: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
}

interface Props {
  notes: Note[];
  onDelete: (id: string | undefined) => void;
  getForm: () => void;
}

const Notes: React.FC<Props> = ({ notes, onDelete, getForm }) => {
  const [currentPage, setCurrentPage] = useState<number>(0);

  const PER_PAGE: number = 3;
  const pageCount: number = Math.ceil(notes.length / PER_PAGE);

  function handlePageclick({ selected }: { selected: number }) {
    setCurrentPage(selected);
  }

  const offset: number = currentPage * PER_PAGE;

  return (
    <>
      <div className="flex flex-col ">
        {notes.slice(offset, offset + PER_PAGE).map((item: Note) => (
          <div key={item._id}>
            <Note note={item} onDelete={onDelete} getForm={getForm} />
          </div>
        ))}
      </div>

      <ReactPaginate
        breakLabel="..."
        previousLabel="< previous"
        nextLabel="next >"
        pageCount={pageCount}
        onPageChange={handlePageclick}
        pageRangeDisplayed={5}
        renderOnZeroPageCount={null}
        className="flex justify-between my-4"
      />
    </>
  );
};

export default Notes;
