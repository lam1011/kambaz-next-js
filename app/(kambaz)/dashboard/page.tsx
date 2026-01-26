import Link from "next/link";
import Image from "next/image";
export default function Dashboard() {
    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
            <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
            <div id="wd-dashboard-courses">
                <div className="wd-dashboard-course">
                    <Link href="/courses/1234" className="wd-dashboard-course-link">
                        <Image src="/images/reactjs.jpg" width={200} height={150} alt="reactjs" />
                        <div>
                            <h5> CS1234 React JS </h5>
                            <p className="wd-dashboard-course-title">
                                Full Stack software developer
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>

                <div className="wd-dashboard-course">
                    <Link href="/courses/1000" className="wd-dashboard-course-link">
                        <Image src="/images/goofy.jpg" width={200} height={150} alt="reactjs" />
                        <div>
                            <h5> CS1000 Goofy AHH </h5>
                            <p className="wd-dashboard-course-title">
                                How to be a Goofy AHH Engineer
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>

                <div className="wd-dashboard-course">
                    <Link href="/courses/1001" className="wd-dashboard-course-link">
                        <Image src="/images/drake.jpg" width={200} height={150} alt="reactjs" />
                        <div>
                            <h5> CS1001 Advanced Goofy AHH </h5>
                            <p className="wd-dashboard-course-title">
                                How to be an Advanced Goofy AHH Engineer
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>

                <div className="wd-dashboard-course">
                    <Link href="/courses/1167" className="wd-dashboard-course-link">
                        <Image src="/images/67.jpg" width={200} height={150} alt="reactjs" />
                        <div>
                            <h5> MATH1167 Six-Seven </h5>
                            <p className="wd-dashboard-course-title">
                                Intro to Mathmatical Six-Seven Theory
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>

                <div className="wd-dashboard-course">
                    <Link href="/courses/2110" className="wd-dashboard-course-link">
                        <Image src="/images/ambatakum.jpg" width={200} height={150} alt="reactjs" />
                        <div>
                            <h5> PHIL2110 Ambatakum </h5>
                            <p className="wd-dashboard-course-title">
                                Societal Norms Within the Ambatakum Religion
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>

                <div className="wd-dashboard-course">
                    <Link href="/courses/2005" className="wd-dashboard-course-link">
                        <Image src="/images/goated.jpg" width={200} height={150} alt="reactjs" />
                        <div>
                            <h5> HIST2005 Birth of the GOAT </h5>
                            <p className="wd-dashboard-course-title">
                                Intro to the Birth of the GOAT (Greatest of All Time)
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>

                <div className="wd-dashboard-course">
                    <Link href="/courses/6969" className="wd-dashboard-course-link">
                        <Image src="/images/gooner.jpg" width={200} height={150} alt="reactjs" />
                        <div>
                            <h5> THTR6969 Advanced Goon Acting </h5>
                            <p className="wd-dashboard-course-title">
                                Advanced Acting on Gooning
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

