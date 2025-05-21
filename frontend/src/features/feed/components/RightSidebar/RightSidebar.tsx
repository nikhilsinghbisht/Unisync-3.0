import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../../components/Button/Button";
import { Loader } from "../../../../components/Loader/Loader";
import { request } from "../../../../utils/api";
import { IUser } from "../../../authentication/contexts/AuthenticationContextProvider";
import { IConnection } from "../../../networking/components/Connection/Connection";
import classes from "./RightSidebar.module.scss";

type Job = {
  id: number;
  title: string;
  companyName: string;
};

export function RightSidebar() {
  const [suggestions, setSuggestions] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Fetch user suggestions
    request<IUser[]>({
      endpoint: "/api/v1/networking/suggestions?limit=2",
      onSuccess: (data) => {
        if (id) {
          setSuggestions(data.filter((s) => s.id !== id));
        } else {
          setSuggestions(data);
        }
      },
      onFailure: (error) => console.log(error),
    }).then(() => setLoading(false));

    // Fetch job highlights
    request<Job[]>({
      endpoint: '/api/v1/jobs/job',
      onSuccess: (data) => {
        setJobs(data.slice(0, 3));
        setJobsLoading(false);
      },
      onFailure: (error) => {
        console.error('Error fetching jobs:', error);
        setJobsLoading(false);
      },
    });
  }, [id]);

  return (
    <div className={classes.root}>
      <h3>Add to your connections</h3>
      <div className={classes.items}>
        {suggestions.map((suggestion) => (
          <div className={classes.item} key={suggestion.id}>
            <button
              className={classes.avatar}
              onClick={() => navigate("/profile/" + suggestion.id)}
            >
              <img src={suggestion.profilePicture || "/avatar.svg"} alt="" />
            </button>
            <div className={classes.content}>
              <button onClick={() => navigate("/profile/" + suggestion.id)}>
                <div className={classes.name}>
                  {suggestion.firstName} {suggestion.lastName}
                </div>
                <div className={classes.title}>
                  {suggestion.position} at {suggestion.company}
                </div>
              </button>
              <Button
                size="medium"
                outline
                className={classes.button}
                onClick={() => {
                  request<IConnection>({
                    endpoint: "/api/v1/networking/connections?recipientId=" + suggestion.id,
                    method: "POST",
                    onSuccess: () => {
                      setSuggestions(suggestions.filter((s) => s.id !== suggestion.id));
                    },
                    onFailure: (error) => console.log(error),
                  });
                }}
              >
                + Connect
              </Button>
            </div>
          </div>
        ))}
        {suggestions.length === 0 && !loading && (
          <div className={classes.empty}>
            <p>No suggestions available at the moment.</p>
          </div>
        )}
        {loading && <Loader isInline />}
      </div>

      {/* Job Highlights Section */}
      <div className={classes.jobs}>
        <h3 className="mt-6 mb-2">Featured Jobs</h3>
        {jobsLoading && <p>Loading jobs...</p>}
        {!jobsLoading && jobs.length > 0 && (
          <ul className={classes.jobList}>
            {jobs.map((job) => (
              <li key={job.id} className={classes.jobItem}>
                <div className={classes.jobTitle}>{job.title}</div>
                <div className={classes.jobCompany}>{job.companyName}</div>
              </li>
            ))}
          </ul>
        )}
        {!jobsLoading && jobs.length > 0 && (
          <button
            className={classes.viewJobsButton}
            onClick={() => navigate("/jobs")}
          >
            View Jobs
          </button>
        )}
      </div>
    </div>
  );
}
