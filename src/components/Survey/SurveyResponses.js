import React, { Fragment } from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import _ from 'lodash';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

const GET_SURVEYRESPONSES = gql`
  query SurveyResponses($surveyId: ID!, $orderBy: SurveyResponseOrderByInput, $last: Int) {
    surveyResponses(surveyId: $surveyId, orderBy: $orderBy, last: $last) {
      id
      respondedAt
      questionResponses {
        questionId
        optionIds
      }
    }
  }
`;

export const SurveyResponses = () => {
  
  // Step 1
  const filterSurveyResponseLast30Days =  ({respondedAt}) => moment(respondedAt) > moment().subtract(30, 'days');
  
  // Step 2
  const mapFlattenSurveyResponse = ({id, questionResponses}) => ({ id, optionIds: [...questionResponses.flat().map(item => item.optionIds.flat()).flat()]});

  // Step 3 => NEJ
  const filterMen26to56NoInfoFound = ({optionIds}) => {
    return (
      optionIds.includes('cjn1oydyf2nbc0a19ynno8luy') && // Fann du informationen du sökte på vår webbplats? => Nej
      optionIds.includes('cjn1oyduo2n4o0a19v90xd53i') && // Är du => man
      ['cjn1oydu32n3s0a19amr8qxdo', 'cjn1oydu42n3u0a19tq40q28z', 'cjn1oydu52n3w0a19sybey14t'].some(el => optionIds.includes(el)) // Vänligen ange din ålder => "26-35 år" || "36-45 år" || "46-55 år"
    )
  };

  // Step 3 => JA
  const filterMen26to56InfoFound = ({optionIds}) => {
    return (
      optionIds.includes('cjn1oydyd2nb80a19mvhb4sen') && // Fann du informationen du sökte på vår webbplats? => Ja
      optionIds.includes('cjn1oyduo2n4o0a19v90xd53i') && // Är du => man
      ['cjn1oydu32n3s0a19amr8qxdo', 'cjn1oydu42n3u0a19tq40q28z', 'cjn1oydu52n3w0a19sybey14t'].some(el => optionIds.includes(el)) // Vänligen ange din ålder => "26-35 år" || "36-45 år" || "46-55 år"
    )
  };
  
  return (
    <Query query={GET_SURVEYRESPONSES} variables={({ surveyId: 'cjn1oydm32n0v0a19xrhxk0tg', orderBy: 'respondedAt_DESC' })} >
      {({ loading, error, data }) => {
        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;
  
        let mutatedResponseNej = data.surveyResponses.filter(filterSurveyResponseLast30Days)
          .map(mapFlattenSurveyResponse)
          .filter(filterMen26to56NoInfoFound)

        let mutatedResponseJa = data.surveyResponses.filter(filterSurveyResponseLast30Days)
          .map(mapFlattenSurveyResponse)
          .filter(filterMen26to56InfoFound)


        let dataGroupedByDays = _.chain(data.surveyResponses)
                      .groupBy(item => moment(item.respondedAt).format('MMDD'))
                      .value();

        const start = moment().subtract(30, 'days')
        const end = moment()
        const range = moment.range(start, end);
        let arrayOfDates = Array.from(range.by('day')).reverse().map(intervalDate => intervalDate = intervalDate.format('MMDD'))

        return (
          <Fragment>
            
            <h1>Undersökning <small>senaste 30 dagarna</small></h1>
            <h2 style={{paddingBottom: 20}}>Män 26-55 år som fann informationen de sökte:</h2>
            <div className="grid-table-container" style={{marginBottom: 60}}>
              <div className="grid-table-cell th">Ja</div>
              <div className="grid-table-cell th">Nej</div>
              <div className="grid-table-cell tr">{mutatedResponseJa.length}</div>
              <div className="grid-table-cell tr">{mutatedResponseNej.length}</div>
            </div>

            <h2 style={{paddingBottom: 20}}>Antalet svar per dag:</h2>
            <div className="grid-table-container">
              <div className="grid-table-cell th">Datum</div>
              <div className="grid-table-cell th">Svar</div>
                {arrayOfDates.map(dateString => (
                  <Fragment key={dateString}>
                  {dataGroupedByDays[dateString] &&
                    <>
                      <div className="grid-table-cell tr">{dateString}</div>
                      <div className="grid-table-cell tr">{dataGroupedByDays[dateString].length}</div>
                    </>
                  }
                  </Fragment>
                ))}
            </div>
         </Fragment>
        );
      }}
    </Query>
  );
}

export default SurveyResponses;
