export default function AssignmentEditor() {
    return (
        <div id="wd-assignments-editor">
            <label htmlFor="wd-name">Assignment Name</label><br /><br />
            <input id="wd-name" defaultValue="A1 - ENV + HTML" /><br /><br />
            <textarea id="wd-description">
                The assignment is available online Submit alink to the landing page of your
                web application running on Netlify. The landing page should include the following:
                Your fulname and section Links to each of the lab assignments Link to the Kanbas application
                Links to all relevant source code repositories The Kanbas application should include a link to navigate back to the landing page.
            </textarea>
            <br /><br />
            <table>
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-points">Points</label>
                    </td>
                    <td>
                        <input id="wd-points" defaultValue={100} />
                    </td>
                </tr>
                <br />

                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-AssignmentGroup">Assignment Group</label>
                    </td>
                    <td>
                        <select id="wd-select-assignment-group">
                            <option selected value="ASSIGNMENT">
                                ASSIGNMENTS
                            </option>
                        </select>
                    </td>
                </tr>
                <br />

                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-Grade-Display">Display Grade as</label>
                    </td>
                    <td>
                        <select id="wd-select-grade-display">
                            <option selected value="Grade-Display">
                                Percentage
                            </option>
                        </select>
                    </td>
                </tr>
                <br />

                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-Submission-Type">Submission Type</label>
                    </td>
                    <td>
                        <select id="wd-select-submission-type">
                            <option selected value="submission-type">
                                Online
                            </option>
                        </select>
                    </td>
                </tr>
                <br />
                <tr>
                    <td></td>
                    <td>
                        <label>Online Entry Options:</label><br />
                        <input type="checkbox" id="wd-chkbox-Text" />
                        <label htmlFor="wd-chkbox-Text">Text Entry</label><br />
                        <input type="checkbox" id="wd-chkbox-URL" />
                        <label htmlFor="wd-chkbox-URL">Website URL</label><br />
                        <input type="checkbox" id="wd-chkbox-Recordings" />
                        <label htmlFor="wd-chkbox-Recordings">Media Recordings</label><br />
                        <input type="checkbox" id="wd-chkbox-Annotation" />
                        <label htmlFor="wd-chkbox-Annotation">Student Annotation</label><br />
                        <input type="checkbox" id="wd-chkbox-File-Uploads" />
                        <label htmlFor="wd-chkbox-File-Uploads">File Uploads</label>
                    </td>
                </tr>
                <br />

                <tr>
                    <td></td>
                    <td>
                        <label>Assign to</label><br />
                        <input type="assign-to" id="wd-assign-to" defaultValue="Everyone" />
                    </td>
                </tr>
                <br />

                <tr>
                    <td></td>
                    <td>
                        <label htmlFor="wd-due-date"> Due </label><br />
                        <input type="date"
                            defaultValue="2024-05-13"
                            id="wd-due-date" />
                    </td>
                </tr>
                <br />

                <tr>
                    <td></td>
                    <td>
                        <label htmlFor="wd-from-date"> Available from </label><br />
                        <input type="date"
                            defaultValue="2024-05-06"
                            id="wd-from-date" />
                    </td>
                    <td>
                        <label htmlFor="wd-until-date"> Until </label><br />
                        <input type="date"
                            defaultValue="2024-05-20"
                            id="wd-until-date" />
                    </td>
                </tr>

            </table>
            <br />

            <div style={{ textAlign: "center" }}>
                <button>Cancel</button>
                <button>Save</button>
            </div>
        </div>
    );
}

