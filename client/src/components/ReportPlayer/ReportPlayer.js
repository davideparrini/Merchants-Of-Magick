import {  useEffect} from 'react';
import './ReportPlayer.scss'




function ReportBoard({ reportTime, setReportTime, reports, setReports,endTurn,setEndTurn, setGameRestart, setTurnDone}) {
    

    useEffect(() => {
        if(reportTime > 0){
            const intervalId = setInterval(() => {
                setReportTime((t)=> t-1);
            }, 1000);
            return () => clearInterval(intervalId);
        }
        else{
            setGameRestart(false);
            setTurnDone(false);
            setEndTurn(false);
            setReports([]);
        }
    },[reportTime]);


    return (
        <div className={`ReportPlayer ${endTurn ? '' : 'no-active-report'}`}> 
            <div className='title-report-player'>Report of the turn</div>
            <div className='container-report'>
                {
                    reports.map((r,i)=>(
                        <div className='player-report' key={i} id={'pr'+ i}>
                            <div className='player-report-username'>{r.username}</div>
                            <div className='player-report-title'>{'Skills Gained :'}</div>
                            {
                                r.report.skills.length > 0 ?
                                    r.report.skills.map((s,j)=>(
                                        <div className='player-report-skill' key={j}>{'- '+ s}</div>
                                    ))
                                : 'No skill gained'

                            }
                            <div className='player-report-title'>{'New Items in the shop :'}</div>
                            {
                                r.report.items.length > 0 ?
                                    r.report.items.map((item,j)=>(
                                        <div className='player-report-item' key={j}>{'- '+ item}</div>
                                    ))
                                : 'No new item'
                            }
                            <div className='player-report-title quest-report'>
                                {'Crafting quest: '}<div className='player-report-quest'>{r.report.quest1 ? 'Done!' : 'Not Done'}</div>
                            </div>
                            <div className='player-report-title quest-report'>
                                {'Magic Research quest: '}<div className='player-report-quest'>{r.report.quest2  ? 'Done!' : 'Not Done'}</div>
                            </div>

                        </div>
                    ))
                }
                
            </div>
            <div className='timer-restart-game'>{'Game restart in ' + reportTime + ' seconds'}</div>
        </div>
    )
}

export default ReportBoard