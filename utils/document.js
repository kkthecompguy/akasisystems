const pdfTemplate = (issues) => {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Issues Report </title>
  <style>
    main {
      background: #f1f5f9;
      padding: 2rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
    .reports {
      text-align: center;
      font-weight: bold;
      font-size: 1.5rem;
      margin: 1rem 0;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    thead tr {
    border-top: 1px solid #f0f0f0;
    border-bottom: 2px solid #f0f0f0;
    }

    thead td {
      font-weight: 700;
    }

    thead th {
      padding: .5rem;
    }

    td {
      padding: .5rem 1rem;
      font-size: .9rem;
      color: #222;
    }
  </style>
</head>
<body>
  <main>
    <div class="reports">Reports</div>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Issue Creator</th>
            <th>Issue</th>
            <th>Status</th>
            <th>Date Created</th>
            <th>Issue Resolver</th>
            <th>Resolve Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>John Doe</td>
            <td>Sir we need deposit</td>
            <td>resolved</td>
            <td>yesterday</td>
            <td>Sam Sean</td>
            <td>Today morning</td>
          </tr>
          <tr>
            <td>1</td>
            <td>John Doe</td>
            <td>Sir we need deposit</td>
            <td>resolved</td>
            <td>yesterday</td>
            <td>Sam Sean</td>
            <td>Today morning</td>
          </tr>
          <tr>
            <td>1</td>
            <td>John Doe</td>
            <td>Sir we need deposit</td>
            <td>resolved</td>
            <td>yesterday</td>
            <td>Sam Sean</td>
            <td>Today morning</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</body>
<script>

</script>
</html>
  `
}

module.exports = pdfTemplate;