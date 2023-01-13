// Función para leer el dataset.
async function obtenerDataSet() {
    try {
        // se obtiene la fuente de datos de pensiones        
        data = await d3.csv("data/dataSetPensiones.csv", d3.autoType)
  
console.log('Datos: ',data)
        return data
    } catch (e) {
        console.error(e)
    }
}

// Configuración de la gráfica
async function load() {
    try {

        // Configuración de tamaños.
        const ancho = 800
        const height = 500
        const padding = 30
        const barWidth = ancho / 50

        // Se adicionan tooltips.
        const tooltip = d3.select("#graf")
            .append('div')
            .attr('id', 'tooltip')
            .style('opacity', 0)

        // Superposición de pantalla
        const overlay = d3.select("#graf")
            .append('div')
            .attr('class', 'overlay')
            .style('opacity', 0)

        // Se configura el contenedor.
        const svg = d3.select("#graf")
            .append('svg')
            .attr('width', ancho + 100)
            .attr('height', height + 60)
  
        // Se obtiene la fuente de datos del csv.
        const data = await obtenerDataSet()
        const anios = data.map(dato => dato['Anio'])
        const pensiones2 = data.map(dato => Number(String(dato['Valor']).replace(',', '.')) || 0)
        const pensiones = data.map(dato => dato['Valor'])

        console.log('pensiones: ',pensiones)
        console.log('pensiones2: ',pensiones2)

        // Se adicionan datos del equipo
        svg.append('text')
            .attr('x', ancho - (ancho / 2) - 80)
            .attr('y', height + 20)
            .text('Equipo 16: ')
            .attr('class', 'info')

        svg.append('text')
            .attr('x', ancho - (ancho / 2) - 80)
            .attr('y', height + 50)
            .text('Integrantes: Rocio Morales / José Ángel Haro / Carlos Enrique Pérez / Felipe Maldonado')
            .attr('class', 'info')

        // Se definen límites para los ejes
        const pensionMaxima = d3.max(pensiones)
        const linearScale = d3.scaleLinear()
            .domain([0, pensionMaxima])
            .range([height, 0])
        console.log('pensionMaxima: ',pensionMaxima)
        const pensionesEscalados = pensiones.map(salario => linearScale(salario))

        const xScale = d3.scaleLinear()
            .domain([d3.min(anios), d3.max(anios)])
            .range([padding, ancho - padding])

        const xAxis = d3.axisBottom()
            .scale(xScale)

        // Se definen límites para los ejes Y
        const yAxisScale = d3.scaleLinear()
            .domain([padding, pensionMaxima])
            .range([height - padding, 0])
        const yAxis = d3.axisLeft(yAxisScale)

        // Configuración de ejes
        svg.append('g')
            .attr('transform', `translate(${padding}, ${height - padding})`)
            .attr('id', 'x-axis')
            .call(xAxis)

        svg.append('g')
            .attr('transform', `translate(${padding * 2}, 0)`)
            .attr('id', 'y-axis')
            .call(yAxis)

        d3.select('svg')
            .selectAll('rect')
            .data(pensionesEscalados)
            .enter()
            .append('rect')
            .attr('data-date', (d, i) => new Date(data[i]['Anio'], 1))
            .attr('data-salario', (d, i) => data[i]['Valor'])
            .attr('class', 'bar')
            .attr('fill', 'rgb(10, 205, 10)')
            .attr('x', (d, i) => xScale(anios[i]))
            .attr('y', d => d)
            .attr('width', `${barWidth}px`)
            .attr('height', (d, i) => Math.max(0, height - padding - d))
            .attr('index', (d, i) => i)
            .attr('transform', `translate(${padding}, 0)`)
            .on('mouseover', function(event, d) {
                const i = this.getAttribute('index')

                overlay.transition()
                    .duration(0)
                    .style('height', `${Math.max(0, height - padding - d)}px`)
                    .style('width', `${barWidth}px`)
                    .style('opacity', 0.9)
                    .style('left', `${xScale(anios[i])}px`)
                    .style('top', `${d}px`)
                    .style('transform', `translateX(${padding}px)`)

                tooltip.transition()
                    .duration(200)
                    .style('opacity', 0.9)

                tooltip.html(`${anios[i]}<br>$${pensiones[i]}`)
                    .attr('data-date', data[i]['Anio'])
                    .style('center', `${xScale(anios[i]) + 30}px`)
                    .style('top', `${height - 100}px`)
                    .style('transform', `translateX(${padding}px)`)
            })
            .on('mouseout', () => {
                tooltip.transition().duration(200).style('opacity', 0)
                overlay.transition().duration(200).style('opacity', 0)
            })

    } catch (error) {
        console.error(error)
    }
}

// Se carga la gráfica
load()