#let function_def(parameter: 2, boolean: false, ..positional) = {
  if type(parameter) == "integer" {
    let len = parameters
    let default_parameters = ($p$, $q$, $r$, $s$, $t$)
    parameters = ()
    let i = 0
    while i != len {
      parameters.push(default_parameters.at(i))
      i += 1
    }
  }
  
  let parameter_values = parameters.map(param => rev)
  let body_row_idx = 1
  let conditions = body.pos()
  let cells = ()

  while true {
    let seen_zero = false
    for value in parameter_values {
      if value {
        cells.push(true_label)
      } else {
        cells.push(false_label)
      }
    }
    for body in conditions {
      if type(body.at(1)) == "function" {
        if body.at(1)(..parameter_values) {
          cells.push(true_label)
        } else {
          cells.push(false_label)
        }
      } else if rev {
        cells.push($#conditions.at(conditions.len() - body_row_idx)$)
      } else {
        cells.push($#body.at(body_row_idx)$)
      }
    }
    if parameter_values.all(value => value == not rev) {
      break
    }
    let next_values = ()
    for value in parameter_values.rev() {
      if value == not rev and not seen_zero {
        next_values.push(rev)
      } else if value == rev and not seen_zero {
        next_values.push(not rev)
        seen_zero = true
      } else {
        next_values.push(value)
      }
    }
    parameter_values = next_values.rev()
    body_row_idx += 1
  }
  
  table(
    ..body.named(),
    columns: parameters.len() + conditions.len(),
    ..parameters, ..conditions.map(arr => [#arr.at(0)]),
    ..cells
  )
}
