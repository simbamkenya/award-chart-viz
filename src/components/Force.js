import React, {useState, useEffect, useRef} from 'react'
import { json, select, selectAll, forceX, forceY, forceManyBody, forceCollide, forceSimulation, range } from 'd3'

function Force() {
  const contRef = useRef(null)
  const [data, setData] = useState([])

  useEffect(()=> {
      json('https://api.nobelprize.org/v1/prize.json')
        .then(data => setData(data))
  },[])

  useEffect(() => {
    const margin = { top: 40, right: 40, bottom: 40, left: 40 },
        width = 960 - margin.left - margin.right,
        height = 640 - margin.top - margin.bottom;
    
    const svg = select(contRef.current).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    
    
        var colorScale = ['orange', 'lightblue', '#B19CD9'];
        var xCenter = [200, 500, 800];
        var yCenter = [50, 180, 330];
        
        var numNodes = 250;
        var nodes = range(numNodes).map(function(d, i) {
            return {
                radius: Math.random() * 10,
                category: i % 3,
            no: Math.floor(Math.random() * 3) 
            }
        });
        console.log(nodes)
        
        const simulation = forceSimulation(nodes)
            .force('charge', forceManyBody().strength(1))
            .force('x', forceX().x(d=> xCenter[d.category]))
        
        simulation.force('y', forceY().y(d => yCenter[d.no]))
            .force('collision', forceCollide().radius(d => d.radius))
            .on('tick', ticked);
        
        function ticked() {
            select('svg g')
                .selectAll('circle')
                .data(nodes)
                .join('circle')
                .attr('r', d => d.radius)
                .style('fill', d => colorScale[d.category])
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);
        }
        
  }, [])
  console.log(data.prizes)

  return (
    <div ref={contRef}></div>
  )
}

export default Force