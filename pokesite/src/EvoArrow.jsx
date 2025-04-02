import { useState, useEffect } from 'react'

function EvoTile({ conditions }) {

  return ( //conditions vs condition. Important distinction, possibly confusing.
    <div className="evoArrow">
      <div className="conditionsArrow" />
      <div className="conditions">
        {conditions?.map((condition, index) => (
          <div className="condition" key={index}>{condition + (index != conditions.length - 1 ? " +" : "")}</div>
        ))}
      </div>
    </div>
  )
}

export default EvoTile;