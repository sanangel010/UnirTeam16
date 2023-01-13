const graf = d3.select("#graf")


const tooltip = d3.select("#graf")
.append('div')
.attr('id', 'tooltip')
.style('opacity', 0)

const overlay = d3.select("#graf")
.append('div')
.attr('class', 'overlay')
.style('opacity', 0)

const margins = { left: 75, top: 40, right: 10, bottom: 50 }
const anchoTotal = +graf.style("width").slice(0, -2)
const altoTotal = (anchoTotal * 9) / 16
//const ancho = anchoTotal - margins.left - margins.right
//const alto = altoTotal - margins.top - margins.bottom
const ancho = 800
const alto = 400
const padding = 30
const barWidth = ancho / 275


const svg = graf
  .append("svg")
  .attr("width", ancho + 100)
  .attr("height", alto + 60)
  .attr("class", "fig")

// const g = svg
//   .append("g")
//   .attr("transform", `translate(${margins.left}, ${margins.top})`)

// g.append("rect")
//   .attr("x", "0")
//   .attr("y", "-15")
//   .attr("width", ancho)
//   .attr("height", alto)
//   .attr("class", "grupo")

// const x = d3.scaleLinear().range([0, ancho])
// const y = d3.scaleLinear().range([alto, 0])

// const xAxis = d3.axisBottom(x).tickSize(-alto)
// const yAxis = d3.axisLeft(y).tickSize(-ancho)

const load = async () => {
  data = await d3.csv("data/dataSetPensiones.csv", d3.autoType)
  
  const anios = data.map(dato => dato['Periodo'])
  //const pensiones = data.map(dato => Number(String(dato['Valor']).replace(',', '.')) || 0)
  const pensiones = data.map(dato => dato['Valor'])



  svg.append('text')
  .attr('x', ancho - (ancho / 2) - 80)
  .attr('y', alto + 20)
  .text('Fuente: https://www.datos.gob.mx/busca/dataset/salario-minimo-historico-1877-2019')
  .attr('class', 'info')

svg.append('text')
  .attr('x', ancho - (ancho / 2) - 50)
  .attr('y', alto + 50)
  .text('Nota: entre los años 1879 a 1885 y entre 1912 a 1933 no hay datos registrados')
  .attr('class', 'info')


  const pensionMaxima = d3.max(pensiones)

  console.log(pensionMaxima)
  
  const linearScale = d3.scaleLinear()
            .domain([0, pensionMaxima])
            .range([alto, 0])

  const pensionEscalada = pensiones.map(pension => linearScale(pension))

  console.log(pensionEscalada)
  


  const xScale = d3.scaleLinear()
  .domain([d3.min(anios), d3.max(anios)])
  .range([padding, ancho - padding])


  const xAxis = d3.axisBottom()
            .scale(xScale)
        const yAxisScale = d3.scaleLinear()
            .domain([padding, pensionMaxima])
            .range([alto - padding, 0])
        const yAxis = d3.axisLeft(yAxisScale)

        svg.append('g')
            .attr('transform', `translate(${padding}, ${alto - padding})`)
            .attr('id', 'x-axis')
            .call(xAxis)

        svg.append('g')
            .attr('transform', `translate(${padding * 2}, 0)`)
            .attr('id', 'y-axis')
            .call(yAxis)



            d3.select('svg')
            .selectAll('rect')
            .data(pensionEscalada)
            .enter()
            .append('rect')
            .attr('data-date', (d, i) => new Date(data[i]['Periodo'], 1))
            .attr('data-valor', (d, i) => Number(String(data[i]['Valor'])) || 0)
            .attr('class', 'bar')
            .attr('fill', 'rgb(10, 205, 10)')
            .attr('x', (d, i) => xScale(anios[i]))
            .attr('y', d => d)
            .attr('width', `${barWidth}px`)
            .attr('height', (d, i) => Math.max(0, alto - padding - d))
            .attr('index', (d, i) => i)
            .attr('transform', `translate(${padding}, 0)`)
            .on('mouseover', function(event, d) {
                const i = this.getAttribute('index')

                overlay.transition()
                .duration(0)
                .style('height', `${Math.max(0, alto - padding - d)}px`)
                .style('width', `${barWidth}px`)
                .style('opacity', 0.9)
                .style('left', `${xScale(anios[i])}px`)
                .style('top', `${d}px`)
                .style('transform', `translateX(${padding}px)`)

            tooltip.transition()
                .duration(200)
                .style('opacity', 0.9)

            tooltip.html(`${anios[i]}<br>$${pensiones[i]} MXN`)
                .attr('data-date', data[i]['Periodo'])
                .style('left', `${xScale(anios[i]) + 30}px`)
                .style('top', `${alto - 100}px`)
                .style('transform', `translateX(${padding}px)`)
        })
        .on('mouseout', () => {
            tooltip.transition().duration(200).style('opacity', 0)
            overlay.transition().duration(200).style('opacity', 0)
        })



  //render(data)
}

const render = (data) => {
  g.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.educacion))
    .attr("cy", (d) => y(d.sueldo))
    .attr("r", 5)
    .attr("fill", "#40916c")
}

load()
