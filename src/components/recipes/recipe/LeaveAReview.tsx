import { api } from "@/utils/api";
import { RadioGroup } from "@headlessui/react";
import { StarIcon } from "@heroicons/react/24/outline";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

import toast from "react-hot-toast";

const stars = [
  { name: "1 star", selectedNumber: "1", value: 1 },
  {
    name: "2 stars",
    selectedNumber: "2",
    value: 2,
  },
  { name: "3 stars", selectedNumber: "3", value: 3 },
  {
    name: "4 stars",
    selectedNumber: "4",
    value: 4,
  },
  {
    name: "5 stars",
    selectedNumber: "5",
    value: 5,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function LeaveAReview({
  recipeId,
  refetch,
}: {
  recipeId: string;
  refetch: () => void;
}) {
  const { data: sessionData } = useSession();

  const userImg = sessionData?.user?.image;

  const [message, setMessage] = useState("");

  const [selectedStar, setSelectedStar] = useState<
    { name: string; selectedNumber: string; value: number } | undefined
  >(stars[1]);

  const createReview = api.user.createReview.useMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.loading("Creating review...");
    try {
      await createReview.mutateAsync({
        recipeId: recipeId,
        comments: message,
        stars: selectedStar?.value as number,
      });
      toast.dismiss();

      toast.success("Review created successfully");
      setMessage("");
      setSelectedStar(stars[1]);
      refetch();
    } catch (error: unknown) {
      toast.dismiss();
      toast.error(error.message as string);
    }
  };

  return (
    <div className="flex items-start justify-center space-x-4 bg-zinc-100 px-4 dark:bg-zinc-900">
      <div className="flex-shrink-0">
        <Image
          className="inline-block h-10 w-10 rounded-full"
          src={userImg || "/no-user-image.jpg"}
          alt=""
          width={40}
          height={40}
        />
      </div>
      <div className="min-w-0 max-w-5xl flex-1">
        <form className="relative" 
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={(e) => handleSubmit(e)}>
          <div className="overflow-hidden rounded-lg border border-zinc-300 shadow-sm focus-within:border-yellow-500 focus-within:ring-1 focus-within:ring-yellow-500">
            <label htmlFor="comment" className="sr-only">
              Add your comment
            </label>
            <textarea
              rows={3}
              name="comment"
              id="comment"
              className="block w-full resize-none border-0 py-3 pl-1 focus:ring-0 sm:text-sm"
              placeholder="Add your comment..."
              defaultValue={""}
              onChange={(e) => setMessage(e.target.value)}
            />

            {/* Spacer element to match the height of the toolbar */}
            <div className="py-2" aria-hidden="true">
              {/* Matches height of button in toolbar (1px border + 36px content height) */}
              <div className="py-px">
                <div className="h-9" />
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between py-2 pl-3 pr-2">
              <div className="flex items-center space-x-5">
                {/* Stars */}
                <RadioGroup value={selectedStar} onChange={setSelectedStar}>
                  <div className="flex items-center space-x-3">
                    {stars.map((star) => (
                      <RadioGroup.Option
                        key={star.name}
                        value={star}
                        className="relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none"
                      >
                        <RadioGroup.Label as="span" className="sr-only">
                          {star.name}
                        </RadioGroup.Label>
                        <StarIcon
                          aria-hidden="true"
                          className={classNames(
                            "h-8 w-8",
                            star.value <= (selectedStar?.value as number)
                              ? "fill-yellow-500 stroke-none"
                              : "stroke-current text-zinc-400"
                          )}
                        />
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              <div className="flex-shrink-0 pl-2">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
