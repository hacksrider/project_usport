/* eslint-disable @typescript-eslint/ban-ts-comment */
import Image from "next/image";
import { GetReview, ResGetAllReview } from "@/app/interface/review";
import axios from "axios";
import { useState, useEffect } from "react";

const ReviewCard = () => {
  const [dataReview, setDataReview] = useState<GetReview[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [reviewCount, setReviewCount] = useState<number | null>(null);

  const reviewApi = async () => {
    try {
      const res = await axios.get<ResGetAllReview>("/api/review");
      // @ts-expect-error
      setDataReview(res.data.data.data);
      // @ts-expect-error
      setReviewCount(res.data.data.reviewCount); // ดึงจำนวนรีวิวทั้งหมด
    } catch (error) {
      console.error("Error fetching Review:", error);
    }
  };

  useEffect(() => {
    reviewApi();
  }, []);

  const displayedReviews = showAll ? dataReview : dataReview.slice(0, 7);

  return (
    <div className="col-span-12 rounded-[10px] bg-white py-6 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-4 p-3">
      <h4 className="mb-3.5 px-4 text-body-2xlg font-bold text-dark dark:text-white">
        รีวิวจากสมาชิก ({reviewCount || 0})
      </h4>

      <div>
        {displayedReviews.map((review, key) => (
          <div
            className="flex items-center gap-4.5 px-7.5 py-1 hover:bg-gray-1 dark:hover:bg-dark-2 border-t-2"
            key={key}
          >
            <div className="relative h-8 w-8 border-2 mr-4 border-gray-300 rounded-full">
              <Image
                width={32}
                height={32}
                src={review.users.user_profile_picture ? `/${review.users.user_profile_picture}` : "/user/img/user.jpeg"}
                alt={review.users.user_name}
              />
            </div>

            <div className="w-full">
              <div>
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-[12px] mt-1 leading-[8px] text-dark dark:text-white">
                    {review.users.user_name} {review.users.user_lastname} {" "}
                    {[...Array(5)].map((_, index) => (
                      <span
                        key={index}
                        className={`${index < review.score ? "text-yellow-400" : "text-gray-300"} text-sm`}
                      >
                        ★
                      </span>
                    ))}
                  </h5>
                  <span className="text-[12px] leading-[8px] text-green-600">
                    {review.service_of_exercise.service_name}
                  </span>
                </div>
                <p>
                  <span className="text-[12px] leading-[8px] text-gray-600">
                    {review.Text_review}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
        {dataReview.length > 7 && !showAll && (
          <div className="flex justify-center">
            <button onClick={() => setShowAll(true)} className="text-center text-blue-700 hover:text-blue-500 border-b-2 border-blue-700 hover:border-blue-500">
              ดูทั้งหมด
            </button>
          </div>
        )}
      </div>

      {showAll && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-3/4 max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-blue-200 p-4 z-10 shadow-md">
              <button onClick={() => setShowAll(false)} className="absolute top-2 right-2 text-gray-700 text-lg">✕</button>
              <h4 className="text-body-2xlg font-bold text-dark">รีวิวทั้งหมด ({reviewCount || 0})</h4>
            </div>
            {dataReview.map((review, key) => (
              <div className="flex items-center gap-4.5 px-7.5 py-1 hover:bg-gray-1 dark:hover:bg-dark-2 border-t-2" key={key}>
                <div className="relative h-8 w-8 border-2 mr-4 border-gray-300 rounded-full">
                  <Image
                    width={32}
                    height={32}
                    src={review.users.user_profile_picture ? `/${review.users.user_profile_picture}` : "/user/img/user.jpeg"}
                    alt={review.users.user_name}
                  />
                </div>
                <div className="w-full">
                  <div>
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-[12px] mt-1 leading-[8px] text-dark dark:text-white">
                        {review.users.user_name} {review.users.user_lastname} {" "}
                        {[...Array(5)].map((_, index) => (
                          <span
                            key={index}
                            className={`${index < review.score ? "text-yellow-400" : "text-gray-300"} text-sm`}
                          >
                            ★
                          </span>
                        ))}
                      </h5>
                      <span className="text-[12px] leading-[8px] text-green-600">
                        {review.service_of_exercise.service_name}
                      </span>
                    </div>
                    <p>
                      <span className="text-[12px] leading-[8px] text-gray-600">
                        {review.Text_review}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default ReviewCard;
