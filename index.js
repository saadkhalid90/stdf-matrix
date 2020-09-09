async function drawMatrix(){
  // read in the coucc Matrix data
  const matrixData = await d3.csv('CouccMatrix.csv');

  // define cell color scale
  const scaleCol = d3.scaleLinear()
                      .domain([0, 15])
                      .range(['white', d3.rgb('#009999')]);

  // from the read in data extract columns
  const columnNames = matrixData.columns;
  // since the first column is empty, shift the array
  columnNames.shift();

  // function to get svg atributes
  function getAttr(svgSel, attrName, pxRemove){
    const attr = d3.select(svgSel).attr(attrName)

    return pxRemove ? attr.replace('px', '') : attr ;
  }
  const svgWidth = +getAttr('svg.correlMatrix', 'width', true);
  const svgHeight = +getAttr('svg.correlMatrix', 'height', true);

  // define margins for the visualization
  const margin = {
    top: 200,
    left: 200,
    right: 136,
    bottom: 220
  };
  // cell padding is the separation in pixels between the cells
  const cellPadding = 1;

  //adjusting the width and height through margins
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  //select the SVG and append a group inside
  const svgG = d3.select('svg.correlMatrix')
                .append('g')
                .attr('class', 'correlMatrixG')
                .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // scales that will help us locate the cells
  const yBands = d3.scaleBand()
    .domain(columnNames)
    .range([0, height]);

  const xBands = d3.scaleBand()
    .domain(columnNames)
    .range([0, width]);


  // grid data that maps questions to options
  const gridData = [[0, 4], [4, 10], [10, 15], [15, 18]];

  const gridLineCol = '#e0e0e0';
  const questGridCol = d3.rgb('#e0e0e0').darker(0);

  //const colArr = [questGridCol, questGridCol, questGridCol, questGridCol]

  const contrastCol = d3.rgb('#eee').darker(0.1);

  const leftBoxes = svgG.append('g')
      .attr('class', 'xLabRectG')
      .selectAll('rect.xLabRect')
      .data(gridData)
      .enter()
      .append('rect')
      .attr('class', 'xLabRect')
      .attr('y', d => d[0] * yBands.bandwidth())
      .attr('x', -200)
      .attr('rx', '5px')
      .attr('ry', '5px')
      .attr('width', 194)
      .attr('height', d => ((d[1] - d[0]) * yBands.bandwidth()) - 1)
      .style('fill', (d, i) => i%2 == 0 ? '#eee' : contrastCol)
      //.style('fill', contrastCol)
      .style('fill-opacity', 1);

  const topBoxes = svgG.append('g')
      .attr('class', 'yLabRectG')
      .selectAll('rect.yLabRect')
      .data(gridData)
      .enter()
      .append('rect')
      .attr('class', 'yLabRect')
      .attr('x', d => d[0] * xBands.bandwidth())
      .attr('y', - 200)
      .attr('rx', '5px')
      .attr('ry', '5px')
      .attr('height', 194)
      .attr('width', d => ((d[1] - d[0]) * xBands.bandwidth()) - 1)
      .style('fill', (d, i) => i%2 == 0 ? '#eee' : contrastCol)
      //.style('fill', contrastCol)
      .style('fill-opacity', 1);

  const rightBoxes = svgG.append('g')
      .attr('class', 'xQRectG')
      .selectAll('rect.xQRect')
      .data(gridData)
      .enter()
      .append('rect')
      .attr('class', 'xQRect')
      .attr('y', d => d[0] * yBands.bandwidth())
      .attr('x', width + 6)
      .attr('rx', '5px')
      .attr('ry', '5px')
      .attr('width', 129)
      .attr('height', d => ((d[1] - d[0]) * yBands.bandwidth()) - 1)
      .style('fill', (d, i) => i%2 == 0 ? '#eee' : contrastCol);
      //.style('fill', (d, i) => contrastCol);


  const bottomBoxes = svgG.append('g')
      .attr('class', 'yQRectG')
      .selectAll('rect.yQRect')
      .data(gridData)
      .enter()
      .append('rect')
      .attr('class', 'yQRect')
      .attr('x', d => d[0] * xBands.bandwidth())
      .attr('y', height + 6)
      .attr('rx', '5px')
      .attr('ry', '5px')
      .attr('height', 70)
      .attr('width', d => ((d[1] - d[0]) * xBands.bandwidth()) - 1)
      .style('fill', (d, i) => i%2 == 0 ? '#eee' : contrastCol)
      //.style('fill', (d, i) => contrastCol);


  const QuestText = [
    ["Q.5 Areas covered by vTPA"],
    ["Q.6 Types of vTPA ", "programs recognized"],
    ["Q.7 Ways in which vTPA", "programs recognized"],
    ["Q.8 How is reliability", "of vTPA programs", "ensured"]
  ];

  const QuestText1 = [
    ["Q.5 Areas covered by vTPA"],
    ["Q.6 Types of vTPA programs recognized"],
    ["Q.7 Ways in which vTPA programs", "recognized"],
    ["Q.8 How is ", "reliability of vTPA ", "programs ensured"]
  ];

  const textPad = 5;

  const rightText = svgG.append('g')
      .attr('class', 'xQTextG')
      .selectAll('text.xQText')
      .data(gridData)
      .enter()
      .append('text')
      .attr('class', 'xQText')
      .style('fill', '#424242')
      .style('font-family', "'Barlow Condensed', sans-serif")
      .style('font-weight', '300')
      .style('font-size', '13px')
      .style('text-anchor', 'start')
      .attr('y', d => d[0] * yBands.bandwidth() + 18)
      .attr('x', width + 6 + textPad)
      .selectAll('tspan')
      .data((d, i) => QuestText[i])
      .enter()
      .append('tspan')
      .attr('dy', (d, i) => i == 0 ? 0 : 15)
      .attr('x', width + 6 + textPad)
      .text((d, i) => d);


    const bottomText = svgG.append('g')
        .attr('class', 'yQTextG')
        .selectAll('text.yQText')
        .data(gridData)
        .enter()
        .append('text')
        .style('fill', '#424242')
        .style('font-family', "'Barlow Condensed', sans-serif")
        .style('font-weight', '300')
        .style('font-size', '13px')
        .style('text-anchor', 'start')
        .attr('class', 'yQText')
        .attr('x', d => d[0] * xBands.bandwidth() + 5)
        .attr('y', height + 25)
        .selectAll('tspan')
        .data((dat, idx) => QuestText1[idx].map(d => {return {data: d, index: dat[0]}}))
        .enter()
        .append('tspan')
        .attr('dy', (d, i) => i == 0 ? 0 : 15)
        .attr('x', d => d.index * xBands.bandwidth() + 5)
        .text((d, i) => d.data);


  const rows = svgG.selectAll('g.matrixRow')
      .data(matrixData)
      .enter()
      .append('g')
      .attr('class', 'matrixRow')
      .attr('transform', d => `translate(0, ${yBands(d.Option)})`);

  const cellG = rows.selectAll('rect.cellG')
      .data((d, i) => columnNames.map(entry => {
        return {index: i, Option: entry}
      }))
      .enter()
      .append('g')
      .attr('class', 'cellG')
      .attr('transform', d => `translate(${xBands(d.Option)}, 0)`)

  cellG.append('rect')
      .attr('class', 'cell')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', xBands.bandwidth() - cellPadding)
      .attr('height', yBands.bandwidth() - cellPadding)
      .attr('rx', '3px')
      .attr('ry', '3px')
      .style('fill', (d, i) => {
          const val = matrixData[d.index][d.Option];
          return (val == "") ? '#F5F5F5' : scaleCol(+val);
      });


    cellG.append('text')
      .attr('class', 'cellLabel')
      .attr('transform', d => `translate(${xBands.bandwidth()/2}, 0)`)
      .attr('x', 0)
      .attr('y', 14)
      .text((d, i) => {
          const val = matrixData[d.index][d.Option];
          return val;
      })
      .style('fill', (d, i) => {
          const val = +matrixData[d.index][d.Option];
          return val > 8 ? 'white' : '#424242';
      })
      .style('font-family', "'Barlow Condensed', sans-serif")
      .style('font-weight', '300')
      .style('font-size', '11px')
      .style('text-anchor', 'middle');


  const leftText = rows.append('text')
    .text(d => d.Option)
    .attr('class', 'rowLabel')
    .attr('x', -200 + textPad)
    .attr('y', 16)
    .style('fill', '#212121')
    .style('font-family', "'Barlow Condensed', sans-serif")
    .style('font-weight', '300')
    .style('font-size', '12px')
    .style('fill', '#424242');

  const topText = d3.select('g.matrixRow')
    .selectAll('text.columnLabel')
    .data(columnNames)
    .enter()
    .append('text')
    .attr('class', 'columnLabel')
    .text(d => d)
    .attr('y', d => xBands(d) + 20)
    .attr('x', 10)
    .style('transform', `rotate(270deg)`)
    .style('fill', `#212121`)
    .style('font-family', "'Barlow Condensed', sans-serif")
    .style('font-weight', '300')
    .style('font-size', '12px')
    .style('fill', '#424242');

  svgG.selectAll('g.cellG')
    .filter((d, i) => d.index <= columnNames.indexOf(d.Option))
    .on('mouseover', function(d, i){
      const datum = d3.select(this).datum();
      const rowIdx = d.index;
      const colIdx = columnNames.indexOf(d.Option);

      const qIdx1 = optionToQIdx(rowIdx, colIdx)[0];
      const qIdx2 = optionToQIdx(rowIdx, colIdx)[1];

      console.log(qIdx1, qIdx2);

      // getting selections and un-selections of selected cell row and column labels
      const selRowLab = svgG.selectAll('text.rowLabel')
        .filter((d, i) => i == rowIdx);
      const unSelRowLab = svgG.selectAll('text.rowLabel')
        .filter((d, i) => i != rowIdx);
      const selColLab = svgG.selectAll('text.columnLabel')
          .filter((d, i) => i == colIdx);
      const unSelColLab = svgG.selectAll('text.columnLabel')
          .filter((d, i) => i != colIdx);

      const selText1 = svgG.selectAll('text.xQText')
          .filter((d, i) => i == qIdx1);
      const unselText1 = svgG.selectAll('text.xQText')
          .filter((d, i) => i != qIdx1);
      const selText2 = svgG.selectAll('text.yQText')
          .filter((d, i) => i == qIdx2);
      const unselText2 = svgG.selectAll('text.yQText')
          .filter((d, i) => i != qIdx2);


      const transDur = 250;

      d3.select(this).raise();

      svgG.append('circle')
        .attr('class', 'interactCirc')
        .attr('cx', (xBands.bandwidth() * colIdx) + xBands.bandwidth()/2)
        .attr('cy', (yBands.bandwidth() * rowIdx) + yBands.bandwidth()/2)
        .attr('r', 20)
        .style('fill', 'none')
        .style('stroke', '#636363')
        .style('stroke-width', '2px')
        .transition('circTrans')
        .duration(transDur)

      selRowLab.transition('transWt')
        .duration(transDur)
        .style('font-weight', 600);
      selColLab.transition('transWt')
        .duration(transDur)
        .style('font-weight', 600);
      selText1.transition('transWtQ')
        .duration(transDur)
        .style('font-weight', 600);
      selText2.transition('transWtQ')
        .duration(transDur)
        .style('font-weight', 600);

      unSelRowLab.transition('transOpac')
        .style('fill-opacity', 0.3)
        .duration(transDur);
      unSelColLab.transition('transOpac')
        .style('fill-opacity', 0.3)
        .duration(transDur);
      unselText1.transition('transOpacQ')
        .style('fill-opacity', 0.3)
        .duration(transDur);
      unselText2.transition('transOpacQ')
        .style('fill-opacity', 0.3)
        .duration(transDur);
    });

    svgG.selectAll('g.cellG')
      .filter((d, i) => d.index <= columnNames.indexOf(d.Option))
      .on('mouseout', function(d, i){
        const datum = d3.select(this).datum();
        const rowIdx = d.index;
        const colIdx = columnNames.indexOf(d.Option);


        const qIdx1 = optionToQIdx(rowIdx, colIdx)[0];
        const qIdx2 = optionToQIdx(rowIdx, colIdx)[1];

        // getting selections and un-selections of selected cell row and column labels
        const selRowLab = svgG.selectAll('text.rowLabel')
          .filter((d, i) => i == rowIdx);
        const unSelRowLab = svgG.selectAll('text.rowLabel')
          .filter((d, i) => i != rowIdx);
        const selColLab = svgG.selectAll('text.columnLabel')
            .filter((d, i) => i == colIdx);
        const unSelColLab = svgG.selectAll('text.columnLabel')
            .filter((d, i) => i != colIdx);

        const selText1 = svgG.selectAll('text.xQText')
            .filter((d, i) => i == qIdx1);
        const unselText1 = svgG.selectAll('text.xQText')
            .filter((d, i) => i != qIdx1);
        const selText2 = svgG.selectAll('text.yQText')
            .filter((d, i) => i == qIdx2);
        const unselText2 = svgG.selectAll('text.yQText')
            .filter((d, i) => i != qIdx2);

        const transDur = 250;

        svgG.select('circle.interactCirc')
          .remove();

        selRowLab.transition('transWt')
          .duration(transDur)
          .style('font-weight', 300);
        selColLab.transition('transWt')
          .duration(transDur)
          .style('font-weight', 300);
        selText1.transition('transWtQ')
          .duration(transDur)
          .style('font-weight', 300);
        selText2.transition('transWtQ')
          .duration(transDur)
          .style('font-weight', 300);

        unSelRowLab.transition('transOpac')
          .duration(transDur)
          .style('fill-opacity', 1)
        unSelColLab.transition('transOpac')
          .duration(transDur)
          .style('fill-opacity', 1);
        unselText1.transition('transOpacQ')
          .duration(transDur)
          .style('fill-opacity', 1)
        unselText2.transition('transOpacQ')
          .duration(transDur)
          .style('fill-opacity', 1);

      });

  function optionToQIdx(rowIdx, colIdx){
      function optionIdxToQIdx(index){
        let qNo;

        if (index >=0 & index < 4){
          qNo = 0;
        }

        else if (index >=4 & index < 10){
          qNo = 1;
        }
        else if (index >=10 & index < 15){
          qNo = 2;
        }
        else {
          qNo = 3;
        }

        return qNo;
      }
      const rowQ = optionIdxToQIdx(rowIdx);
      const colQ = optionIdxToQIdx(colIdx);

      return [rowQ, colQ];
  }

// svgG.append('g')
//     .attr('class', 'xGridG')
//     .selectAll('line.xGLines')
//     .data(gridData.map(d => d * yBands.bandwidth()))
//     .enter()
//     .append('line')
//     .attr('class', 'xGLines')
//     .attr('x1', '0')
//     .attr('x2', width)
//     .attr('y1', d => d)
//     .attr('y2', d => d)
//     .style('stroke', gridLineCol)
//     .style('stroke-width', '1px');
//
// svgG.append('g')
//     .attr('class', 'yGridG')
//     .selectAll('line.yGLines')
//     .data(gridData.map(d => d * xBands.bandwidth()))
//     .enter()
//     .append('line')
//     .attr('class', 'yGLines')
//     .attr('y1', 0)
//     .attr('y2', height)
//     .attr('x1', d => d)
//     .attr('x2', d => d)
//     .style('stroke', gridLineCol)
//     .style('stroke-width', '1px');



}

drawMatrix();
