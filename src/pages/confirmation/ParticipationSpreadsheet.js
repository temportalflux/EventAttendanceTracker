
const XML_OUTLINE =
`<html xmlns:x="urn:schemas-microsoft-com:office:excel">
<head>
<xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
<x:Name>Error Messages</x:Name>
<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>
</x:ExcelWorksheets></x:ExcelWorkbook></xml>
<style>
.header {
font-weight:bold;
font-size: 20pt;
}
.subHeader {
font-size: 16pt;
}
.headerCell {
border: 1pt solid black;
}
</style>
</head>
<body>
<table>
    <tbody>
        <tr>
            <td class="header" colspan="7" align="center">Champlain College Residential Life</td>
        </tr>
        <tr>
            <td class="subHeader" colspan="7" align="center"><i>Programming Participants</i></td>
        </tr>
        <tr></tr>
        <tr>
            <td class="headerCell">ID Numbers</td>
            <td class="headerCell">Program Title</td>
            <td class="headerCell">Date</td>
            <td class="headerCell">Start Time</td>
            <td class="headerCell">End Time</td>
            <td class="headerCell">Residence Hall</td>
            <td class="headerCell">Program Type</td>
            <td class="headerCell">Off Campus</td>
        </tr>
        $\{CONTENT}
    </tbody>
</table>
</body>
</html>`;

export default class ParticipationSpreadsheet {

    constructor(evtName, evtType, location, idNumbers, date, timeStart, timeEnd, offCampus) {
        this.eventDetails = [evtName, date, timeStart, timeEnd, location, evtType, offCampus];
        this.idNumbers = idNumbers;

        this.build = this.build.bind(this);

    }

    build() {
        let ids = [...this.idNumbers];
        let rows = [
            // first row has 1 id, and all the event details
            [`${ids.shift()}`, ...this.eventDetails],
            // all other rows just have an id
            ...(ids.map((id) => [id])),
        ];
        // serialize to tr/td
        rows = rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`);
        // join all rows
        let content = rows.join('');
        return XML_OUTLINE.replace(`$\{CONTENT}`, content);
    }

}