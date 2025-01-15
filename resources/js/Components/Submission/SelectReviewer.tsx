import { FC } from 'react';

interface Props {
  suggestedReviewers: any[];
  setData: (property: string, value: any) => void;
}
const SelectReviewer: FC<Props> = ({ suggestedReviewers, setData }) => {
  return (
    <>
      <select
        disabled={suggestedReviewers.length === 0}
        className="mt-4 w-full rounded border border-gray-300 bg-gray-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring"
        onChange={(e) => setData('reviewer_id', parseInt(e.target.value))}
      >
        <option value="">Select Reviewer</option>
        {suggestedReviewers.map((reviewer) => (
          <option key={reviewer.id} value={reviewer.id}>
            {reviewer.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default SelectReviewer;
