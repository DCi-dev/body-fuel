import type { Review } from "@/types";
import {
  ChatBubbleLeftEllipsisIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Reviews = ({ reviews }: { reviews: Review[] }) => {
  return (
    <div className="mt-16 flow-root px-4 text-left">
      <ul role="list" className="mx-auto -mb-8 max-w-5xl">
        {reviews.map((review, index) => (
          <li key={review.id}>
            <div className="relative pb-8">
              {index !== reviews.length - 1 ? (
                <span
                  className="absolute top-5 left-5 -ml-px h-full w-0.5 "
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3">
                <div className="relative">
                  <Image
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 ring-8 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-900"
                    src={review.user.image}
                    alt={review.user.name}
                    width={40}
                    height={40}
                  />

                  <span className="absolute -bottom-0.5 -right-1 rounded-tl bg-zinc-100 px-0.5 py-px dark:bg-zinc-900">
                    <ChatBubbleLeftEllipsisIcon
                      className="h-5 w-5 text-zinc-800 dark:text-zinc-200"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <div className="min-w-0 flex-1 pl-4">
                  <div>
                    <div className="text-lg">
                      <p className="font-bold text-zinc-900 dark:text-zinc-100">
                        {review.user.name}
                      </p>
                    </div>
                    {/* Stars */}
                    <div className="flex flex-row">
                      {Array.from({ length: 5 }, (_, i) => (
                        <StarIcon
                          aria-hidden="true"
                          key={i}
                          className={classNames(
                            "h-5 w-5",
                            i < review.stars
                              ? "fill-yellow-500 stroke-none"
                              : "stroke-current text-zinc-400"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 text-base text-zinc-700 dark:text-zinc-300">
                    <p>{review.comments}</p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reviews;
