export default function Modules() {
    return (
        <div>
            <button> Collapse All </button>
            <button> View Progress </button>
            <select id="publish-all-modules">
                <option selected value="Publish All">Publish All</option>
            </select>
            <button> + Module </button>

            <ul id="wd-modules">

                <li className="wd-module">
                    <div className="wd-title">Week 1</div>
                    <ul className="wd-lessons">
                        <li className="wd-lesson">
                            <span className="wd-title">LEARNING OBJECTIVES</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Introduction to the course</li>
                                <li className="wd-content-item">Learn what is Web Development</li>
                            </ul>
                            <span className="wd-title">READING</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Full Stack Developer -Chapter 1 - Introduction</li>
                                <li className="wd-content-item">Full Stack Developer -Chapter 2 - Creating User</li>
                            </ul>
                        </li>
                    </ul>
                </li>

                <li className="wd-module">
                    <div className="wd-title">Week 2</div>
                    <ul className="wd-lessons">
                        <li className="wd-lesson">
                            <span className="wd-title">LEARNING OBJECTIVES</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Learn how to create user interfaces with HMI</li>
                                <li className="wd-content-item">Deploy the assignment to Netlify</li>
                            </ul>
                            <span className="wd-title">SLIDES</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Introduction to HTML and the DOM</li>
                                <li className="wd-content-item">Formatting Web content with Headings and</li>
                            </ul>
                        </li>
                    </ul>
                </li>

                <li className="wd-module"> <div className="wd-title">Week 3</div> </li>
            </ul>
        </div>
    );
}

