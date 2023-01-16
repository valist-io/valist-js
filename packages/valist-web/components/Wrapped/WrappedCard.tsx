/* eslint-disable @next/next/no-img-element */
import { ProjectMeta } from '@valist/sdk';

interface Stats {
  ReleaseCreated?: number,
  PriceChanged?: number,
  ProjectUpdated?: number,
  ProductPurchased?: number,
  ProjectCreated?: number,
  ProjectMemberAdded?: number,
  AccountUpdated?: number,
  AccountMemberRemoved?: number,
  AccountMemberAdded?: number,
  AccountCreated?: number,
  AccountReleases?: number,
  TotalTransactions?: number,
  FirstProject: any,
  LatestProject: any,
}

export interface WrappedCardProps {
  stats: Stats, 
  data: any, 
  logs: any,
  meta: ProjectMeta, 
  address: string,
  rank: string,
}

export function WrappedCard(props: WrappedCardProps) {
  return (
    <div style={{ padding: "64px 32px", display: "flex", alignItems: "center", flexDirection: "column", background: 'linear-gradient(270deg, #8680F8 0.01%, #4152CF 100%)', height: 550, width: 450 }}>
      <div style={{ display: 'flex', backgroundColor: '#fae8cf', borderRadius: 8, width: 386, marginBottom: 19 }}>
        <div style={{ fontSize: 96, padding: "5px 15px", fontWeight: 700, lineHeight: 1, color: "#F79009" }}>
          {String(props.stats.ProjectCreated)}
        </div>
        <div style={{ display: 'flex', flexDirection: "column", padding: "35px 0" }}>
          <div style={{ fontSize: 16, color: "#9B9BB1", fontWeight: 400 }}>
            Total Projects
          </div>
          <div style={{ fontSize: 24, color: "#1E1D26" }}>
            Published
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 15, width: 386, border: "0.5px solid #FFFFFF", padding: 16, borderRadius: 8, color: "#FFFFFF", marginBottom: 24 }}>
        <div style={{ display: "flex" }}>
          Total Releases: {String(props.stats.ReleaseCreated)}
        </div>
        <div style={{ display: "flex" }}>
          No. of on-chain transactions: {String(props.stats.TotalTransactions)}
        </div>
        <div style={{ display: "flex" }}>
          Software Licenses created: {String(props.stats.PriceChanged)}
        </div>
        <div style={{ display: "flex" }}>
          Valist Ranking: {props.rank}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", width: 386, fontSize: 12, color: "#CBC9F9" }}>
        <div style={{ marginBottom: 8 }}>Your First Project</div>
        <div style={{ display: "flex", gap: 16 }}>
          {props.meta.image && <img width="130" height="100" alt="project-img" src={props.meta.image} />}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexWrap: "wrap", wordWrap: "break-word", fontWeight: 700, fontSize: 18, color: "white" }}>{String(props.stats.FirstProject.name)}</div>
            <div>{String(props.meta.short_description)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};