"use strict"

let tooltip = d3.select('body')
   .append('div')
      .attr('id', 'tooltip')

const request = new Request('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
fetch(request)
.then((response) => response.json())
.then((response) => {
   const dataset = response.data
   const pad = 40
   // I'm not sure what's contributing this extra 20ish pixels
   // Probably something to do with the brower's default CSS
   const w = window.innerWidth - 20
   const h1 = document.querySelector('#title')
   const h = window.innerHeight - h1.offsetHeight - h1.offsetTop - 20
   const date_min = new Date(d3.min(dataset, d => d[0]))
   const date_max = new Date(d3.max(dataset, d => d[0]))
   const x_scale = d3.scaleTime([date_min, date_max], [pad, w - pad])
   const y_scale = d3.scaleLinear([0, d3.max(dataset, d => d[1])], [h - pad, pad])
   const bar_width = Math.floor(w / dataset.length)
   const x_axis = d3.axisBottom(x_scale)
   const y_axis = d3.axisLeft(y_scale)

   let svg = d3.select('body')
      .append('svg')
         .attr('width', w)
         .attr('height', h)

   svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0, ${h-pad})`)
      .call(x_axis)

   svg.append('g')
      .attr('id', 'y-axis')
      .attr('transform', `translate(${pad}, 0)`)
      .call(y_axis)


   svg.selectAll('rect')
         .data(dataset)
         .enter()
         .append('rect')
            .attr('class', 'bar')
            .attr('data-date', d => d[0])
            .attr('data-gdp', d => d[1])
            .attr('x', d => x_scale(new Date(d[0])))
            .attr('y', d => y_scale(d[1]))
            .attr('width', bar_width)
            .attr('height', d => h - pad - y_scale(d[1]))
            .on('mouseover', (d, i) => {
               tooltip.style('visibility', 'visible')
               .style('left', `${w/2}px`)
               .style('top', `${h/2}px`)
               .attr('data-date', d[0])
               .html(`${d[0]}<br />$${d[1]} billion`)
            })
            .on ('mouseout', () => {
               tooltip.style('visibility', 'hidden')
            })
})
